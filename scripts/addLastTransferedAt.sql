ALTER TABLE parcels ADD last_transferred_at BIGINT;
CREATE INDEX blockchain_events_name_index ON blockchain_events USING BTREE(name);
CREATE INDEX blockchain_events_args_asset_id_index ON blockchain_events USING BTREE((args->>'assetId'));
UPDATE parcels P SET last_transferred_at = (SELECT BT.timestamp FROM blockchain_events B, block_timestamps BT WHERE B.block_number = BT.block_number AND B.name = 'Transfer' AND B.args->>'assetId' = P.asset_id ORDER BY BT.block_number DESC LIMIT 1);
