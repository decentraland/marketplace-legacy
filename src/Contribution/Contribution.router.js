"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decentraland_commons_1 = require("decentraland-commons");
const Contribution_model_1 = require("./Contribution.model");
const lib_1 = require("../lib");
class ContributionRouter extends lib_1.Router {
    mount() {
        /**
         * Get the contributions for an address
         * @param  {string} address - District contributor
         * @return {array<Contribution>}
         */
        this.app.get('/api/addresses/:address/contributions', decentraland_commons_1.server.handleRequest(this.getAddressContributions));
    }
    async getAddressContributions(req) {
        const address = decentraland_commons_1.server.extractFromReq(req, 'address');
        const contributions = await Contribution_model_1.Contribution.findGroupedByAddress(address.toLowerCase());
        return decentraland_commons_1.utils.mapOmit(contributions, lib_1.blacklist.contribution);
    }
}
exports.ContributionRouter = ContributionRouter;
//# sourceMappingURL=Contribution.router.js.map