"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decentraland_commons_1 = require("decentraland-commons");
const District_model_1 = require("./District.model");
const lib_1 = require("../lib");
class DistrictRouter extends lib_1.Router {
    mount() {
        /**
         * Returns all stored districts
         * @return {array<District>}
         */
        this.app.get('/api/districts', decentraland_commons_1.server.handleRequest(this.getDistricts));
    }
    async getDistricts() {
        const districts = await District_model_1.District.findEnabled();
        return decentraland_commons_1.utils.mapOmit(districts, lib_1.blacklist.district);
    }
}
exports.DistrictRouter = DistrictRouter;
//# sourceMappingURL=District.router.js.map