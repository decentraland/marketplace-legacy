"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Publication_model_1 = require("./Publication.model");
const Parcel_1 = require("../Parcel");
const Estate_1 = require("../Estate");
class PublicationService {
    constructor() {
        this.Publication = Publication_model_1.Publication;
        this.Parcel = Parcel_1.Parcel;
        this.Estate = Estate_1.Estate;
    }
    getModelFromType(type) {
        if (!this.Publication.isValidType(type)) {
            throw new Error(`Invalid publication type "${type}"`);
        }
        return {
            [this.Publication.TYPES.parcel]: this.Parcel,
            [this.Publication.TYPES.estate]: this.Estate
        }[type];
    }
}
exports.PublicationService = PublicationService;
//# sourceMappingURL=Publication.service.js.map