ALTER TABLE publications ADD expires_at_ts BIGINT;
UPDATE publications SET expires_at_ts = EXTRACT(epoch from expires_at) * 1000;
ALTER TABLE publications DROP expires_at;
ALTER TABLE publications RENAME expires_at_ts TO expires_at;
