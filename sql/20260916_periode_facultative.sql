-- Migration Neon: rendre la période facultative pour Location et Marché d'occasion
-- Les annonces existantes sont conservées.

BEGIN;

ALTER TABLE annonces
  ALTER COLUMN periode DROP NOT NULL;

UPDATE annonces
SET periode = NULL
WHERE univers = 'occasion';

UPDATE annonces
SET is_vip = FALSE
WHERE univers = 'occasion';

COMMIT;
