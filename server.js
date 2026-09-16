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
import fs from "fs";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(cors());

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false, message: { error: "Trop de tentatives. Réessayez dans 15 minutes." } });
const generalLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false, message: { error: "Trop de requêtes. Veuillez patienter." } });
const annonceLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 15, standardHeaders: true, legacyHeaders: false, message: { error: "Trop d'annonces publiées. Réessayez plus tard." } });
app.use(generalLimiter);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const MOTS_IMMOBILIER = ["maison", "duplex", "appartement", "villa", "terrain", "parcelle", "immeuble", "résidence", "résidentiel", "résidentielle", "lotissement", "promoteur", "bien immobilier", "agence immobilière", "immobilier", "immobilière", "locatif", "locative", "cadastre", "foncier", "propriété immobilière", "vente immobilière"];
const MOTS_ILLEGAUX = ["drogue", "drogues", "cocaine", "cocaïne", "héroïne", "heroine", "marijuana", "cannabis", "crack", "mdma", "ecstasy", "fentanyl", "méthamphétamine", "methamphetamine", "arme à feu", "armes à feu", "pistolet", "revolver", "kalachnikov", "munitions", "explosif", "grenade", "prostitution", "escorte sexuelle", "call-girl", "faux billet", "faux billets", "fausse carte", "faux passeport", "faux diplôme", "faux documents", "faux papiers", "terrorisme", "terroriste"];
function normaliser(texte) { return (texte || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
function detecterMotsInterdits(titre, description) {
  const texte = normaliser(titre + " " + description);
  for (const mot of MOTS_IMMOBILIER) if (new RegExp(`\\b${normaliser(mot).replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}\\b`).test(texte)) return { type: "immobilier", mot };
  for (const mot of MOTS_ILLEGAUX) if (new RegExp(`\\b${normaliser(mot).replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}\\b`).test(texte)) return { type: "illegal", mot };
  return null;
}

cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
async function uploadImage(base64) {
  try { if (!base64 || !base64.startsWith("data:image")) return ""; const result = await cloudinary.uploader.upload(base64, { folder: "nia_rdc" }); return result.secure_url; } catch { return ""; }
}

// Migration additive : les anciennes annonces restent dans l'univers Location.
async function preparerUnivers() {
  try {
    await pool.query(`ALTER TABLE annonces ADD COLUMN IF NOT EXISTS univers VARCHAR(30) NOT NULL DEFAULT 'location'`);
    await pool.query(`ALTER TABLE annonces ADD COLUMN IF NOT EXISTS etat_objet VARCHAR(40)`);
    await pool.query(`ALTER TABLE annonces ADD COLUMN IF NOT EXISTS avenue TEXT`);
    await pool.query(`ALTER TABLE annonces ADD COLUMN IF NOT EXISTS numero_parcelle TEXT`);
    await pool.query(`CREATE INDEX IF NOT EXISTS annonces_univers_idx ON annonces(univers)`);
    console.log("✅ Séparation des univers prête.");
  } catch (error) { console.error("⚠️ Migration univers non appliquée :", error.message); }
}

app.post("/auth/register", authLimiter, async (req, res) => {
  try {
    const { telephone, password } = req.body;
    if (!telephone || !password) return res.status(400).json({ error: "Champs manquants." });
    const exists = await pool.query("SELECT id FROM users WHERE telephone = $1", [telephone]);
    if (exists.rows.length) return res.status(400).json({ error: "Ce numéro est déjà utilisé." });
    const nup = "NUP-" + Math.floor(1000 + Math.random() * 9000);
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query("INSERT INTO users (telephone, password, nup, accepted_terms) VALUES ($1, $2, $3, TRUE) RETURNING id, telephone, nup", [telephone, hash, nup]);
    res.json({ success: true, user: result.rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post("/auth/login", authLimiter, async (req, res) => {
  try {
    const { telephone, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE telephone = $1", [telephone]);
    if (!result.rows.length) return res.status(400).json({ error: "Utilisateur introuvable." });
    if (!(await bcrypt.compare(password, result.rows[0].password))) return res.status(400).json({ error: "Mot de passe incorrect." });
    const u = result.rows[0];
    res.json({ success: true, user: { id: u.id, telephone: u.telephone, nup: u.nup, is_admin: u.is_admin } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete("/auth/delete-account", async (req, res) => { try { await pool.query("DELETE FROM users WHERE id = $1", [req.body.user_id]); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); } });

async function requeteAnnonces(univers = null) {
  const where = univers ? "WHERE a.univers = $1" : "";
  const params = univers ? [univers] : [];
  const result = await pool.query(`SELECT a.*, u.nup as proprietaire_nup, COALESCE(JSON_AGG(JSON_BUILD_OBJECT('id', ai.id, 'url', ai.image_url)) FILTER (WHERE ai.id IS NOT NULL), '[]') as images FROM annonces a LEFT JOIN users u ON a.user_id = u.id LEFT JOIN annonce_images ai ON a.id = ai.annonce_id ${where} GROUP BY a.id, u.nup ORDER BY a.is_vip DESC, a.created_at DESC`, params);
  return result.rows;
}
app.get("/feed", async (req, res) => { try { res.json(await requeteAnnonces("location")); } catch { res.json([]); } });
app.get("/api/feed", async (req, res) => { try { res.json(await requeteAnnonces("location")); } catch { res.json([]); } });

app.post("/annonces", annonceLimiter, async (req, res) => {
  try {
    const { user_id, titre, description, prix, devise, periode, ville, commune, quartier, telephone, statut, is_vip, images_base64 } = req.body;
    const violation = detecterMotsInterdits(titre, description);
    if (violation) return res.status(400).json({ error: violation.type === "immobilier" ? `Les annonces immobilières ne sont pas autorisées sur cette plateforme (mot détecté : "${violation.mot}").` : `Votre annonce contient un contenu interdit (mot détecté : "${violation.mot}"). Publication refusée.` });
    const result = await pool.query("INSERT INTO annonces (user_id, titre, description, prix, devise, periode, ville, commune, quartier, telephone, statut, is_vip, univers, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'location',NOW()) RETURNING id", [user_id || null, titre, description, prix || 0, devise || '$', periode || 'jour', ville || 'Lubumbashi', commune || '', quartier || '', telephone, statut || 'disponible', is_vip || false]);
    if (Array.isArray(images_base64)) for (const image of images_base64) { const url = await uploadImage(image); if (url) await pool.query("INSERT INTO annonce_images (annonce_id, image_url) VALUES ($1,$2)", [result.rows[0].id, url]); }
    res.json({ success: true, id: result.rows[0].id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// API dédiée au Marché d'occasion : aucune annonce Location n'est exposée ici.
app.get("/marketplace/feed", async (req, res) => { try { res.json(await requeteAnnonces("occasion")); } catch { res.json([]); } });
app.post("/marketplace/annonces", annonceLimiter, async (req, res) => {
  try {
    const { user_id, titre, prix, devise, etat_objet, statut, telephone, description, ville, commune, quartier, avenue, numero_parcelle, images_base64 } = req.body;
    if (!titre || !String(titre).trim()) return res.status(400).json({ error: "Le titre est obligatoire." });
    const violation = detecterMotsInterdits(titre, description);
    if (violation?.type === "illegal") return res.status(400).json({ error: `Contenu interdit détecté : "${violation.mot}".` });
    const result = await pool.query(`INSERT INTO annonces (user_id,titre,description,prix,devise,periode,ville,commune,quartier,avenue,numero_parcelle,telephone,statut,is_vip,univers,etat_objet,created_at) VALUES ($1,$2,$3,$4,$5,NULL,$6,$7,$8,$9,$10,$11,$12,FALSE,'occasion',$13,NOW()) RETURNING id`, [user_id || null, titre.trim(), description || '', prix || 0, devise || '$', ville || '', commune || '', quartier || '', avenue || '', numero_parcelle || '', telephone || '', statut || 'disponible', etat_objet || 'Bon état']);
    if (Array.isArray(images_base64)) for (const image of images_base64.slice(0, 5)) { const url = await uploadImage(image); if (url) await pool.query("INSERT INTO annonce_images (annonce_id,image_url) VALUES ($1,$2)", [result.rows[0].id, url]); }
    res.json({ success: true, id: result.rows[0].id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/marketplace/annonces/:id", async (req, res) => {
  try {
    const { titre, prix, devise, etat_objet, statut, telephone, description, ville, commune, quartier, avenue, numero_parcelle, nouvelles_images_base64 } = req.body;
    const violation = detecterMotsInterdits(titre, description);
    if (violation?.type === "illegal") return res.status(400).json({ error: `Contenu interdit détecté : "${violation.mot}".` });
    const result = await pool.query(`UPDATE annonces SET titre=$1,prix=$2,devise=$3,etat_objet=$4,statut=$5,telephone=$6,description=$7,ville=$8,commune=$9,quartier=$10,avenue=$11,numero_parcelle=$12 WHERE id=$13 AND univers='occasion'`, [titre, prix, devise, etat_objet, statut, telephone, description, ville, commune, quartier, avenue, numero_parcelle, req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: "Annonce d'occasion introuvable." });
    if (Array.isArray(nouvelles_images_base64)) for (const image of nouvelles_images_base64.slice(0, 5)) { const url = await uploadImage(image); if (url) await pool.query("INSERT INTO annonce_images (annonce_id,image_url) VALUES ($1,$2)", [req.params.id, url]); }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete("/marketplace/annonces/:id", async (req, res) => { try { const result = await pool.query("DELETE FROM annonces WHERE id=$1 AND univers='occasion'", [req.params.id]); res.json({ success: result.rowCount > 0 }); } catch (e) { res.status(500).json({ error: e.message }); } });

// Routes communes conservées pour l'univers Location.
app.put("/annonces/:id", async (req, res) => { try { const { titre, prix, devise, periode, description, statut, ville, commune, telephone, nouvelles_images_base64 } = req.body; const violation = detecterMotsInterdits(titre, description); if (violation) return res.status(400).json({ error: "Contenu refusé." }); await pool.query("UPDATE annonces SET titre=$1,prix=$2,devise=$3,periode=$4,description=$5,statut=$6,ville=$7,commune=$8,telephone=$9 WHERE id=$10 AND univers='location'", [titre, prix, devise, periode, description, statut, ville, commune, telephone, req.params.id]); if (Array.isArray(nouvelles_images_base64)) for (const image of nouvelles_images_base64) { const url = await uploadImage(image); if (url) await pool.query("INSERT INTO annonce_images (annonce_id,image_url) VALUES ($1,$2)", [req.params.id, url]); } res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); } });
app.delete("/images/:id", async (req, res) => { try { await pool.query("DELETE FROM annonce_images WHERE id=$1", [req.params.id]); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); } });
app.delete("/annonces/:id/delete", async (req, res) => { try { await pool.query("DELETE FROM annonces WHERE id=$1", [req.params.id]); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); } });
app.post("/annonces/:id/signaler", async (req, res) => { try { await pool.query("INSERT INTO annonce_reports (annonce_id,raison) VALUES ($1,$2)", [req.params.id, req.body.raison || "Non spécifié"]); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); } });
app.post("/annonces/:id/boost", async (req, res) => { try { await pool.query("UPDATE annonces SET created_at=NOW() WHERE id=$1 AND univers='location'", [req.params.id]); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); } });

// Les routes historiques de messagerie et d'administration restent disponibles dans le fichier précédent via la même API.
app.use(express.static(__dirname));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

const PORT = process.env.PORT || 5000;
preparerUnivers().finally(() => app.listen(PORT, () => console.log(`Serveur opérationnel sur le port ${PORT}`)));
