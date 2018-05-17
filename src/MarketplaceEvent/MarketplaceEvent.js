"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decentraland_commons_1 = require("decentraland-commons");
const Publication_1 = require("../Publication");
class MarketplaceEvent {
    constructor(event) {
        this.event = event;
    }
    getId() {
        // TODO: makeshift method, check pending
        return decentraland_commons_1.env.get('MARKETPLACE_CONTRACT_ADDRESS');
    }
    getType() {
        // TODO: makeshift method, check pending
        return Publication_1.Publication.TYPES.parcel;
    }
}
exports.MarketplaceEvent = MarketplaceEvent;
//# sourceMappingURL=MarketplaceEvent.js.map