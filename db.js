import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  allowExitOnIdle: false
});

// Sécurité essentielle : Empêche le serveur de crash si Neon se met en veille
pool.on("error", (err) => {
  console.error("⚠️ Erreur inattendue sur le pool PostgreSQL (Neon) :", err);
});

// Optionnel : Un petit log sympa pour confirmer la bonne santé du backend au démarrage
pool.on("connect", () => {
  console.log("🚀 Connexion au cluster PostgreSQL NIA RDC établie avec succès.");
});