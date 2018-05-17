"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decentraland_eth_1 = require("decentraland-eth");
const Publication_1 = require("../Publication");
const database_1 = require("../database");
class Asset {
    constructor(Model) {
        this.Model = Model;
        this.tableName = Model.tableName;
    }
    async findByOwner(owner) {
        return await database_1.db.query(database_1.SQL `SELECT ${database_1.SQL.raw(this.tableName)}.*, (
        ${Publication_1.PublicationQueries.findLastParcelPublicationJsonSql()}
      ) as publication
        FROM ${database_1.SQL.raw(this.tableName)}
        WHERE owner = ${owner}`);
    }
    async findByOwnerAndStatus(owner, status) {
        return await database_1.db.query(database_1.SQL `SELECT DISTINCT ON(asset.id, pub.status) asset.*, row_to_json(pub.*) as publication
        FROM ${database_1.SQL.raw(this.tableName)} as asset
        LEFT JOIN (
          ${Publication_1.PublicationQueries.findByStatusSql(status)}
        ) as pub ON asset.id = pub.asset_id
        WHERE asset.owner = ${owner}
          AND pub.tx_hash IS NOT NULL`);
    }
    // TODO: ParcelAttributes, StateAttributes return value
    async filter(filters) {
        const { status, type, sort, pagination } = filters.sanitize();
        const tx_status = decentraland_eth_1.txUtils.TRANSACTION_STATUS.confirmed;
        const [assets, total] = await Promise.all([
            database_1.db.query(database_1.SQL `SELECT model.*, row_to_json(pub.*) as publication
          FROM ${database_1.raw(Publication_1.Publication.tableName)} as pub
          JOIN ${database_1.raw(this.tableName)} as model ON model.id = pub.asset_id
          WHERE status = ${status}
            AND tx_status = ${tx_status}
            AND type = ${type}
            AND ${Publication_1.PublicationQueries.whereisActive()}
          ORDER BY pub.${database_1.raw(sort.by)} ${database_1.raw(sort.order)}
          LIMIT ${database_1.raw(pagination.limit)} OFFSET ${database_1.raw(pagination.offset)}`),
            this.countAssetPublications(filters)
        ]);
        return { assets, total };
    }
    async countAssetPublications(filters) {
        const { status, type } = filters.sanitize();
        const tx_status = decentraland_eth_1.txUtils.TRANSACTION_STATUS.confirmed;
        const counts = await database_1.db.query(database_1.SQL `SELECT COUNT(*)
          FROM ${database_1.raw(Publication_1.Publication.tableName)}
          WHERE status = ${status}
            AND tx_status = ${tx_status}
            AND type = ${type}
            AND ${Publication_1.PublicationQueries.whereisActive()}`);
        return parseInt(counts[0].count, 10);
    }
}
exports.Asset = Asset;
//# sourceMappingURL=Asset.js.map