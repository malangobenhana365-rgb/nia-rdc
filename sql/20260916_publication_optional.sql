-- Migration Neon: publication souple
-- Tous les champs de publication deviennent facultatifs,
-- sauf le téléphone et l'adresse.
-- À exécuter après le schéma principal.

BEGIN;

-- Le titre, la description, le prix, la devise et l'état ne sont plus obligatoires.
ALTER TABLE annonces
  ALTER COLUMN titre DROP NOT NULL,
  ALTER COLUMN prix SET DEFAULT 0,
  ALTER COLUMN devise SET DEFAULT '$';

-- Valeurs de remplacement pour les anciennes données incomplètes.
UPDATE annonces SET prix = 0 WHERE prix IS NULL;
UPDATE annonces SET devise = '$' WHERE devise IS NULL OR BTRIM(devise) = '';
UPDATE annonces SET ville = 'Non précisée' WHERE ville IS NULL OR BTRIM(ville) = '';
UPDATE annonces SET commune = 'Non précisée' WHERE commune IS NULL OR BTRIM(commune) = '';
UPDATE annonces SET quartier = 'Non précisé' WHERE quartier IS NULL OR BTRIM(quartier) = '';
UPDATE annonces SET avenue = 'Non précisée' WHERE avenue IS NULL OR BTRIM(avenue) = '';
UPDATE annonces SET numero_parcelle = 'Non précisé' WHERE numero_parcelle IS NULL OR BTRIM(numero_parcelle) = '';

-- Les publications occasion gardent leur règle : pas de période ni de VIP.
UPDATE annonces
SET periode = NULL,
    is_vip = FALSE
WHERE univers = 'occasion';

-- Contrôle des statuts acceptés.
UPDATE annonces
SET statut = 'disponible'
WHERE statut IS NULL
   OR statut NOT IN ('disponible', 'occupe', 'reserve', 'vendu');

COMMIT;
