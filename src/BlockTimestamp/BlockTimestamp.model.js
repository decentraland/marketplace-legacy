"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decentraland_commons_1 = require("decentraland-commons");
class BlockTimestamp extends decentraland_commons_1.Model {
    static async findTimestamp(block_number) {
        const blockTimestamp = await this.find({ block_number }, null, 'LIMIT 1');
        return blockTimestamp.length ? blockTimestamp[0].timestamp : null;
    }
}
BlockTimestamp.tableName = 'block_timestamps';
BlockTimestamp.primaryKey = 'block_number';
BlockTimestamp.columnNames = ['block_number', 'timestamp'];
exports.BlockTimestamp = BlockTimestamp;
//# sourceMappingURL=BlockTimestamp.model.js.map