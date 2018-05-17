"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decentraland_commons_1 = require("decentraland-commons");
const Parcel_model_1 = require("./Parcel.model");
const Publication_1 = require("../Publication");
const Asset_1 = require("../Asset");
const lib_1 = require("../lib");
class ParcelRouter extends lib_1.Router {
    mount() {
        /**
         * Returns the parcels in between the supplied coordinates
         * Or filtered by the supplied params
         * @param  {string} nw - North west coordinate
         * @param  {string} sw - South west coordinate
         * @param  {string} status - specify a publication status to retreive: [cancelled|sold|pending].
         * @param  {string} sort_by - Publication prop
         * @param  {string} sort_order - asc or desc
         * @param  {number} limit
         * @param  {number} offset
         * @return {array<Parcel>}
         */
        this.app.get('/api/parcels', decentraland_commons_1.server.handleRequest(this.getParcels));
        /**
         * Returns the parcels an address owns
         * @param  {string} address  - Parcel owner
         * @param  {string} [status] - specify a publication status to retreive: [cancelled|sold|pending].
         * @return {array<Parcel>}
         */
        this.app.get('/api/addresses/:address/parcels', decentraland_commons_1.server.handleRequest(this.getAddressParcels));
    }
    async getParcels(req) {
        let parcels;
        let total;
        try {
            const nw = decentraland_commons_1.server.extractFromReq(req, 'nw');
            const se = decentraland_commons_1.server.extractFromReq(req, 'se');
            const rangeParcels = await Parcel_model_1.Parcel.inRange(nw, se);
            parcels = decentraland_commons_1.utils.mapOmit(rangeParcels, lib_1.blacklist.parcel);
            total = parcels.length;
        }
        catch (error) {
            // Force parcel type
            req.params.type = Publication_1.Publication.TYPES.parcel;
            const result = await new Asset_1.AssetRouter(this.app).getAssets(req);
            parcels = result.assets;
            total = result.total;
        }
        return { parcels, total };
    }
    async getAddressParcels(req) {
        const address = decentraland_commons_1.server.extractFromReq(req, 'address').toLowerCase();
        let parcels = [];
        try {
            const status = decentraland_commons_1.server.extractFromReq(req, 'status');
            parcels = await Parcel_model_1.Parcel.findByOwnerAndStatus(address, status);
        }
        catch (error) {
            parcels = await Parcel_model_1.Parcel.findByOwner(address);
        }
        return decentraland_commons_1.utils.mapOmit(parcels, lib_1.blacklist.parcel);
    }
}
exports.ParcelRouter = ParcelRouter;
//# sourceMappingURL=Parcel.router.js.map