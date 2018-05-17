"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decentraland_commons_1 = require("decentraland-commons");
const uuid = require("uuid");
exports.ROADS_ID = 'f77140f9-c7b4-4787-89c9-9fa0e219b079';
exports.PLAZA_ID = '55327350-d9f0-4cae-b0f3-8745a0431099';
class District extends decentraland_commons_1.Model {
    static isRoad(id) {
        return exports.ROADS_ID === id;
    }
    static isPlaza(id) {
        return exports.PLAZA_ID === id;
    }
    static findEnabled() {
        return this.find({ disabled: false });
    }
    static findByName(name) {
        return this.findOne({ name });
    }
    static insert(district) {
        district.id = district.id || uuid.v4();
        return decentraland_commons_1.Model.insert(district);
    }
}
District.tableName = 'districts';
District.columnNames = [
    'id',
    'name',
    'description',
    'link',
    'public',
    'parcel_count',
    'parcel_ids',
    'priority',
    'center',
    'disabled'
];
exports.District = District;
//# sourceMappingURL=District.model.js.map