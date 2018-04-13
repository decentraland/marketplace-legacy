ALTER TABLE blockchain_events DROP CONSTRAINT blockchain_events_pkey;
ALTER TABLE blockchain_events ADD PRIMARY KEY(tx_hash, log_index);
