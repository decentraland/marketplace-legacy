"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decentraland_commons_1 = require("decentraland-commons");
const database_1 = require("../database");
class Contribution extends decentraland_commons_1.Model {
    static findByAddress(address) {
        return this.find({ address });
    }
    static findGroupedByAddress(address) {
        return this.db.query(database_1.SQL `SELECT address, district_id, sum(land_count) as land_count
        FROM ${database_1.SQL.raw(this.tableName)}
        WHERE address = ${address}
        GROUP BY address, district_id`);
    }
}
Contribution.tableName = 'contributions';
Contribution.columnNames = [
    'id',
    'address',
    'district_id',
    'land_count',
    'timestamp'
];
exports.Contribution = Contribution;
//# sourceMappingURL=Contribution.model.js.map