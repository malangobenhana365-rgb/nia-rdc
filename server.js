app.post("/annonces", annonceLimiter, async (req, res) => {
  try {
    let { user_id, titre, description, prix, devise, periode, ville, commune, quartier, telephone, statut, is_vip, images_base64 } = req.body;

    const violation = detecterMotsInterdits(titre, description);
    if (violation) {
      const msg = violation.type === "immobilier"
        ? "Les annonces immobilières ne sont pas autorisées sur cette plateforme (mot détecté : " + violation.mot + ")."
        : "Votre annonce contient un contenu interdit (mot détecté : " + violation.mot + "). Publication refusée.";
      return res.status(400).json({ error: msg });
    }

    const fields = await pool.query(
      `INSERT INTO annonces (user_id, titre, description, prix, devise, periode, ville, commune, quartier, telephone, statut, is_vip, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()) RETURNING id`,
      [user_id || null, titre, description, prix || 0, devise || '$', periode || 'jour', ville || 'Lubumbashi', commune || '', quartier || '', telephone, statut || 'disponible', is_vip || false]
    );

    const id = fields.rows[0].id;
    if (images_base64 && Array.isArray(images_base64)) {
      for (let b64 of images_base64) {
        const url = await uploadImage(b64);
        if (url) await pool.query("INSERT INTO annonce_images (annonce_id, image_url) VALUES ($1, $2)", [id, url]);
      }
    }
    res.json({ success: true, id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/annonces/:id", async (req, res) => {
  try {
    const { titre, prix, devise, periode, description, statut, ville, commune, telephone, nouvelles_images_base64 } = req.body;

    const violation = detecterMotsInterdits(titre, description);
    if (violation) {
      const msg = violation.type === "immobilier"
        ? "Les annonces immobilières ne sont pas autorisées sur cette plateforme (mot détecté : " + violation.mot + ")."
        : "Votre annonce contient un contenu interdit (mot détecté : " + violation.mot + "). Publication refusée.";
      return res.status(400).json({ error: msg });
    }

    await pool.query(
      `UPDATE annonces SET titre=$1, prix=$2, devise=$3, periode=$4, description=$5, statut=$6, ville=$7, commune=$8, telephone=$9 WHERE id=$10`,
      [titre, prix, devise, periode, description, statut, ville, commune, telephone, req.params.id]
    );

    if (nouvelles_images_base64 && Array.isArray(nouvelles_images_base64)) {
      for (let b64 of nouvelles_images_base64) {
        const url = await uploadImage(b64);
        if (url) await pool.query("INSERT INTO annonce_images (annonce_id, image_url) VALUES ($1, $2)", [req.params.id, url]);
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
    await pool.query(
      "INSERT INTO annonce_reports (annonce_id, raison) VALUES ($1, $2)",
      [req.params.id, req.body.raison || "Non spécifié"]
    );
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
      if (ownerRes.rows.length > 0) destinataire_id = ownerRes.rows[0].user_id;
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
    if (adminRes.rows.length === 0) return res.status(403).json({ error: "Pas d'admin configuré." });
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
