import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── SÉCURITÉ : En-têtes HTTP durcis ───────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// ─── PERFORMANCE : Compression gzip ────────────────────────────────────────
app.use(compression());

// ─── CORS ──────────────────────────────────────────────────────────────────
app.use(cors());

// ─── LIMITES : Protection contre les attaques par force brute (auth) ───────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives. Réessayez dans 15 minutes." }
});

// ─── LIMITES : Protection générale contre le spam et les robots ─────────────
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de requêtes. Veuillez patienter." }
});

const annonceLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop d'annonces publiées. Réessayez plus tard." }
});

app.use(generalLimiter);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(__dirname));

// ─── PAGE D'ACCUEIL : AFFICHAGE PROPRE NIA RDC ─────────────────────────────
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenue sur NIA RDC</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #0d1117;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          text-align: center;
        }
        .container {
          padding: 20px;
        }
        .logo {
          font-size: 3em;
          font-weight: bold;
          color: #f1c40f;
          margin-bottom: 10px;
        }
        .status {
          background-color: #238636;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          font-size: 0.9em;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">NIA RDC</div>
        <div class="status">✓ Service Backend Opérationnel</div>
        <p>Le serveur fonctionne parfaitement.</p>
      </div>
    </body>
    </html>
  `);
});

// ─── FILTRAGE DE CONTENU ────────────────────────────────────────────────────

// Mots liés à l'immobilier – interdits sur cette plateforme
const MOTS_IMMOBILIER = [
  "maison", "duplex", "appartement", "villa", "terrain", "parcelle",
  "immeuble", "résidence", "résidentiel", "résidentielle", "lotissement",
  "promoteur", "bien immobilier", "agence immobilière", "immobilier",
  "immobilière", "locatif", "locative", "cadastre", "foncier",
  "propriété immobilière", "vente immobilière"
];

// Mots liés à un contenu illégal
const MOTS_ILLEGAUX = [
  "drogue", "drogues", "cocaine", "cocaïne", "héroïne", "heroine",
  "marijuana", "cannabis", "crack", "mdma", "ecstasy", "fentanyl",
  "méthamphétamine", "methamphetamine",
  "arme à feu", "armes à feu", "pistolet", "revolver", "kalachnikov",
  "munitions", "explosif", "grenade",
  "prostitution", "escorte sexuelle", "call-girl",
  "faux billet", "faux billets", "fausse carte", "faux passeport",
  "faux diplôme", "faux documents", "faux papiers",
  "terrorisme", "terroriste"
];

function normaliser(texte) {
  return (texte || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detecterMotsInterdits(titre, description) {
  const texte = normaliser(titre + " " + description);
  for (const mot of MOTS_IMMOBILIER) {
    const motNorm = normaliser(mot);
    const re = new RegExp(`\\b${motNorm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    if (re.test(texte)) {
      return { type: "immobilier", mot };
    }
  }
  for (const mot of MOTS_ILLEGAUX) {
    const motNorm = normaliser(mot);
    const re = new RegExp(`\\b${motNorm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    if (re.test(texte)) {
      return { type: "illegal", mot };
    }
  }
  return null;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImage(base64){
  try {
    if (!base64 || !base64.startsWith("data:image")) return "";
    const res = await cloudinary.uploader.upload(base64, { folder: "nia_rdc" });
    return res.secure_url;
  } catch (e) { return ""; }
}

// INSCRIPTION AVEC SÉCURITÉ ET GÉNÉRATION AUTOMATIQUE DU NUP
app.post("/auth/register", authLimiter, async (req, res) => {
  try {
    const { telephone, password } = req.body;
    if (!telephone || !password) return res.status(400).json({ error: "Champs manquants." });

    const userExist = await pool.query("SELECT id FROM users WHERE telephone = $1", [telephone]);
    if (userExist.rows.length > 0) return res.status(400).json({ error: "Ce numéro est déjà utilisé." });

    const nupAleatoire = "NUP-" + Math.floor(1000 + Math.random() * 9000);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (telephone, password, nup, accepted_terms) VALUES ($1, $2, $3, TRUE) RETURNING id, telephone, nup",
      [telephone, hashedPassword, nupAleatoire]
    );
    res.json({ success: true, user: newUser.rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// CONNEXION SÉCURISÉE BCRYPT
app.post("/auth/login", authLimiter, async (req, res) => {
  try {
    const { telephone, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE telephone = $1", [telephone]);
    if (result.rows.length === 0) return res.status(400).json({ error: "Utilisateur introuvable." });

    const match = await bcrypt.compare(password, result.rows[0].password);
    if (!match) return res.status(400).json({ error: "Mot de passe incorrect." });

    res.json({ success: true, user: { id: result.rows[0].id, telephone: result.rows[0].telephone, nup: result.rows[0].nup, is_admin: result.rows[0].is_admin } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// SUPPRESSION COMPLÈTE DU COMPTE (RGPD / SÉCURITÉ)
app.delete("/auth/delete-account", async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.body.user_id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// FLUX GÉNÉRAL AVEC IMAGES ET TRI VIP PRIORITAIRE
app.get("/feed", async (req, res) => {
  try {
    const query = `
      SELECT a.*, u.nup as proprietaire_nup,
             COALESCE(JSON_AGG(JSON_BUILD_OBJECT('id', ai.id, 'url', ai.image_url)) FILTER (WHERE ai.id IS NOT NULL), '[]') as images
      FROM annonces a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN annonce_images ai ON a.id = ai.annonce_id
      GROUP BY a.id, u.nup
      ORDER BY a.is_vip DESC, a.created_at DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (e) { res.json([]); }
});

// Compatibilité avec les clients qui appellent /api/feed
app.get("/api/feed", async (req, res) => {
  try {
    const query = `
      SELECT a.*, u.nup as proprietaire_nup,
             COALESCE(JSON_AGG(JSON_BUILD_OBJECT('id', ai.id, 'url', ai.image_url)) FILTER (WHERE ai.id IS NOT NULL), '[]') as images
      FROM annonces a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN annonce_images ai ON a.id = ai.annonce_id
      GROUP BY a.id, u.nup
      ORDER BY a.is_vip DESC, a.created_at DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (e) { res.json([]); }
});

app.post("/annonces", annonceLimiter, async (req, res) => {
  try {
    let { user_id, titre, description, prix, devise, periode, ville, commune, quartier, telephone, statut, is_vip, images_base64 } = req.body;

    const violation = detecterMotsInterdits(titre, description);
    if (violation) {
      const msg = violation.type === "immobilier"
        ? `Les annonces immobilières ne sont pas autorisées sur cette plateforme (mot détecté : "${violation.mot}").`
        : `Votre annonce contient un contenu interdit (mot détecté : "${violation.mot}"). Publication refusée.`;
      return res.status(400).json({ error: msg });
    }

    const fields = await pool.query(
      `INSERT INTO annonces (user_id, titre, description, prix, devise, periode, ville, commune, quartier, telephone, statut, is_vip, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()) RETURNING id`,
      [user_id || null, titre, description, prix || 0, devise || '$', periode || 'jour', ville || 'Lubumbashi', commune || '', quartier || '', telephone, statut || 'disponible', is_vip || false]
    );
    const id = fields.rows[0].id;
    if(images_base64 && Array.isArray(images_base64)){
      for(let b64 of images_base64){
        const url = await uploadImage(b64);
        if(url) await pool.query("INSERT INTO annonce_images (annonce_id, image_url) VALUES ($1, $2)", [id, url]);
      }
    }
    res.json({ success: true, id });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put("/annonces/:id", async (req, res) => {
  try {
    const { titre, prix, devise, periode, description, statut, ville, commune, telephone, nouvelles_images_base64 } = req.body;

    const violation = detecterMotsInterdits(titre, description);
    if (violation) {
      const msg = violation.type === "immobilier"
        ? `Les annonces immobilières ne sont pas autorisées sur cette plateforme (mot détecté : "${violation.mot}").`
        : `Votre annonce contient un contenu interdit (mot détecté : "${violation.mot}"). Modification refusée.`;
      return res.status(400).json({ error: msg });
    }

    await pool.query(
      `UPDATE annonces SET titre=$1, prix=$2, devise=$3, periode=$4, description=$5, statut=$6, ville=$7, commune=$8, telephone=$9 WHERE id=$10`,
      [titre, prix, devise, periode, description, statut, ville, commune, telephone, req.params.id]
    );
    if(nouvelles_images_base64 && Array.isArray(nouvelles_images_base64)){
      for(let b64 of nouvelles_images_base64){
        const url = await uploadImage(b64);
        if(url) await pool.query("INSERT INTO annonce_images (annonce_id, image_url) VALUES ($1, $2)", [req.params.id, url]);
      }
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/images/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM annonce_images WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/annonces/:id/boost", async (req, res) => {
  try {
    await pool.query("UPDATE annonces SET created_at = NOW() WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/annonces/:id/delete", async (req, res) => {
  try {
    await pool.query("DELETE FROM annonces WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// SIGNALEMENT SÉCURISÉ DES ANNONCES
app.post("/annonces/:id/signaler", async (req, res) => {
  try {
    await pool.query("INSERT INTO annonce_reports (annonce_id, raison) VALUES ($1, $2)", [req.params.id, req.body.raison || "Non spécifié"]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/admin/reports", async (req, res) => {
  try {
    const query = `
      SELECT r.id as report_id, r.raison, r.created_at as reported_at, a.*, u.nup as proprietaire_nup,
             COALESCE(JSON_AGG(JSON_BUILD_OBJECT('id', ai.id, 'url', ai.image_url)) FILTER (WHERE ai.id IS NOT NULL), '[]') as images
      FROM annonce_reports r
      JOIN annonces a ON r.annonce_id = a.id
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN annonce_images ai ON a.id = ai.annonce_id
      GROUP BY r.id, a.id, u.nup ORDER BY r.created_at DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// MESSAGERIE CONTEXTUELLE PRIVÉE
app.post("/chat/send", async (req, res) => {
  try {
    const { annonce_id, expediteur_id, contenu, provenance_contexte } = req.body;
    let destinataire_id = null;

    if (annonce_id) {
      const ownerRes = await pool.query("SELECT user_id FROM annonces WHERE id = $1", [annonce_id]);
      if(ownerRes.rows.length > 0) destinataire_id = ownerRes.rows[0].user_id;
    }

    if (!destinataire_id) return res.status(404).json({ error: "Bénéficiaire introuvable." });

    await pool.query(
      "INSERT INTO messages_priveis (annonce_id, expediteur_id, destinataire_id, contenu, provenance_contexte) VALUES ($1, $2, $3, $4, $5)",
      [annonce_id || null, expediteur_id, destinataire_id, contenu, provenance_contexte || 'normal']
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ENVOI GLOBAL (MESSAGES IMPOSSIBLES À RÉPONDRE)
app.post("/admin/broadcast", async (req, res) => {
  try {
    const { contenu } = req.body;
    const adminRes = await pool.query("SELECT id FROM users WHERE is_admin = TRUE LIMIT 1");
    if(adminRes.rows.length === 0) return res.status(403).json({ error: "Pas d'admin configuré." });
    const adminId = adminRes.rows[0].id;

    const allUsers = await pool.query("SELECT id FROM users WHERE is_admin = FALSE");

    for (let u of allUsers.rows) {
      await pool.query(
        "INSERT INTO messages_priveis (annonce_id, expediteur_id, destinataire_id, contenu, provenance_contexte) VALUES (NULL, $1, $2, $3, 'broadcast')",
        [adminId, u.id, contenu]
      );
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/admin/send-to-nup", async (req, res) => {
  try {
    const { annonce_id, contenu, provenance_contexte } = req.body;
    const adminRes = await pool.query("SELECT id FROM users WHERE is_admin = TRUE LIMIT 1");
    const adminId = adminRes.rows[0].id;

    const ownerRes = await pool.query("SELECT user_id FROM annonces WHERE id = $1", [annonce_id]);
    if (ownerRes.rows.length === 0) return res.status(404).json({ error: "Annonce introuvable." });
    const destinataire_id = ownerRes.rows[0].user_id;

    await pool.query(
      "INSERT INTO messages_priveis (annonce_id, expediteur_id, destinataire_id, contenu, provenance_contexte) VALUES ($1, $2, $3, $4, $5)",
      [annonce_id, adminId, destinataire_id, contenu, provenance_contexte || 'normal']
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/chat/reply-justification/:msg_id", async (req, res) => {
  try {
    const { reponse } = req.body;
    await pool.query("UPDATE messages_priveis SET reponse_utilisateur = $1 WHERE id = $2", [reponse, req.params.msg_id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/chat/conversations/:user_id", async (req, res) => {
  try {
    const uid = req.params.user_id;
    const query = `
      SELECT m.*, a.titre as annonce_titre, u1.nup as expediteur_nup, u2.nup as destinataire_nup
      FROM messages_priveis m
      LEFT JOIN annonces a ON m.annonce_id = a.id
      JOIN users u1 ON m.expediteur_id = u1.id
      JOIN users u2 ON m.destinataire_id = u2.id
      WHERE m.expediteur_id = $1 OR m.destinataire_id = $1
      ORDER BY m.created_at DESC;
    `;
    const result = await pool.query(query, [uid]);
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/admin/all-justifications/:context", async (req, res) => {
  try {
    const query = `
      SELECT m.*, a.titre as annonce_titre, u.nup as user_nup
      FROM messages_priveis m
      LEFT JOIN annonces a ON m.annonce_id = a.id
      JOIN users u ON m.expediteur_id = u.id
      WHERE m.provenance_contexte = $1 AND m.reponse_utilisateur IS NOT NULL
      ORDER BY m.created_at DESC;
    `;
    const result = await pool.query(query, [req.params.context]);
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// LISTE DE TOUS LES MESSAGES POUR L'ADMIN
app.get("/admin/messages", async (req, res) => {
  try {
    const query = `
      SELECT m.*, u1.nup as expediteur_nup, u2.nup as destinataire_nup, a.titre as annonce_titre
      FROM messages_priveis m
      JOIN users u1 ON m.expediteur_id = u1.id
      JOIN users u2 ON m.destinataire_id = u2.id
      LEFT JOIN annonces a ON m.annonce_id = a.id
      ORDER BY m.created_at DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// SUPPRESSION DÉFINITIVE D'UN MESSAGE PAR L'ADMIN (disparaît pour tous)
app.delete("/admin/messages/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: "Identifiant invalide." });
    const result = await pool.query("DELETE FROM messages_priveis WHERE id = $1 RETURNING id", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Message introuvable." });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur opérationnel v2 sur le port ${PORT}`));
