-- Migration Neon: supprime définitivement l'ancienne contrainte CHECK
-- "annonces_occasion_nos_periodes_check" qui empêchait les annonces
-- du marché d'occasion d'avoir une période renseignée.
-- La colonne "periode" ayant déjà été retirée (voir 20260928_drop_periode.sql),
-- cette contrainte est obsolète et doit être supprimée.

BEGIN;

ALTER TABLE annonces
  DROP CONSTRAINT IF EXISTS annonces_occasion_nos_periodes_check;

COMMIT;
