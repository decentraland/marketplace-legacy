"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decentraland_commons_1 = require("decentraland-commons");
const database_1 = require("../database");
class BlockchainEvent extends decentraland_commons_1.Model {
    static async insertWithoutConflicts(blockchainEvent) {
        const now = new Date();
        blockchainEvent.created_at = now;
        blockchainEvent.updated_at = now;
        const values = Object.values(blockchainEvent);
        return this.db.query(`INSERT INTO ${this.tableName}(
       ${this.db.toColumnFields(blockchainEvent)}
      ) VALUES(
       ${this.db.toValuePlaceholders(blockchainEvent)}
      ) ON CONFLICT (tx_hash, log_index) DO NOTHING;`, values);
    }
    static async findLastBlockNumber() {
        const { block_number } = await this.findOne(null, {
            block_number: 'DESC',
            log_index: 'DESC'
        });
        return block_number;
    }
    static findFrom(blockNumber) {
        return this.db.query(database_1.SQL `SELECT *
        FROM ${database_1.SQL.raw(this.tableName)}
        WHERE block_number > ${blockNumber}
        ORDER BY block_number ASC, log_index ASC`);
    }
    static findByAssetId(assetId) {
        return this.db.query(database_1.SQL `SELECT *
        FROM ${database_1.SQL.raw(this.tableName)}
        WHERE args->>'assetId' = ${assetId}
        ORDER BY block_number DESC, log_index DESC`);
    }
}
BlockchainEvent.tableName = 'blockchain_events';
BlockchainEvent.primaryKey = 'tx_hash';
BlockchainEvent.columnNames = ['tx_hash', 'name', 'block_number', 'log_index', 'args'];
BlockchainEvent.EVENTS = Object.freeze({
    publicationCreated: 'AuctionCreated',
    publicationSuccessful: 'AuctionSuccessful',
    publicationCancelled: 'AuctionCancelled',
    parcelTransfer: 'Transfer',
    parcelUpdate: 'Update'
});
exports.BlockchainEvent = BlockchainEvent;
//# sourceMappingURL=BlockchainEvent.model.js.map