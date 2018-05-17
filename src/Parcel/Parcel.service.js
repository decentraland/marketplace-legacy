"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decentraland_eth_1 = require("decentraland-eth");
const decentraland_commons_1 = require("decentraland-commons");
const Parcel_model_1 = require("./Parcel.model");
const coordinates_1 = require("./coordinates");
const lib_1 = require("../lib");
const log = new decentraland_commons_1.Log('ParcelService');
const { LANDRegistry } = decentraland_eth_1.contracts;
class ParcelService {
    constructor() {
        this.Parcel = Parcel_model_1.Parcel;
    }
    async insertMatrix(minX, minY, maxX, maxY) {
        for (let x = minX; x <= maxX; x++) {
            const inserts = [];
            for (let y = minY; y <= maxY; y++) {
                inserts.push(this.Parcel.insert({ x, y }).catch(skipDuplicateError));
            }
            await Promise.all(inserts);
        }
    }
    async getLandOf(address) {
        let parcels = [];
        try {
            const contract = this.getLANDRegistryContract();
            const [xCoords, yCoords] = await contract.landOf(address);
            for (let i = 0; i < xCoords.length; i++) {
                const x = xCoords[i].toNumber();
                const y = yCoords[i].toNumber();
                const id = this.Parcel.buildId(x, y);
                parcels.push({ id, x, y });
            }
        }
        catch (error) {
            log.warn(`An error occurred getting the land of ${address}.\nError: ${error.message}`);
            throw error;
        }
        return parcels;
    }
    async addLandData(parcels) {
        const contract = this.getLANDRegistryContract();
        const parcelPromises = parcels.map(async (parcel) => {
            let data;
            try {
                const landData = await contract.landData(parcel.x, parcel.y);
                data = LANDRegistry.decodeLandData(landData);
            }
            catch (error) {
                if (error.name === 'DataError') {
                    data = { version: ParcelService.CURRENT_DATA_VERSION };
                }
                else {
                    throw error;
                }
            }
            return Object.assign({}, parcel, { data });
        });
        return await Promise.all(parcelPromises);
    }
    async isOwner(address, parcel) {
        let isOwner = false;
        try {
            const owner = await this.getOwnerOfLand(parcel);
            isOwner = !decentraland_eth_1.Contract.isEmptyAddress(owner) && address === owner;
        }
        catch (error) {
            log.warn(`An error occurred verifying if ${address} owns ${JSON.stringify(parcel)}.\nError: ${error.message}`);
            throw error;
        }
        return isOwner;
    }
    async addOwners(parcels) {
        let newParcels = [];
        try {
            const addresses = await this.getOwnerOfLandMany(parcels);
            for (const [index, parcel] of parcels.entries()) {
                const address = addresses[index];
                const owner = decentraland_eth_1.Contract.isEmptyAddress(address) ? null : address;
                newParcels.push(Object.assign({}, parcel, { owner }));
            }
        }
        catch (error) {
            log.warn(`An error occurred adding owners for ${parcels.length} parcels.\nError: ${error.message}`);
            throw error;
        }
        return newParcels;
    }
    async addAssetIds(parcels) {
        let newParcels = [];
        try {
            const assetIdFetches = parcels.map(async (parcel) => {
                const assetId = await this.getAssetId(parcel);
                return Object.assign({}, parcel, { asset_id: assetId.toString() });
            });
            newParcels = await Promise.all(assetIdFetches);
        }
        catch (error) {
            log.warn(`An error occurred adding owners for ${parcels.length} parcels.\nError: ${error.message}`);
            throw error;
        }
        return newParcels;
    }
    async getOwnerOfLand(parcel) {
        const contract = this.getLANDRegistryContract();
        const { x, y } = parcel;
        return await contract.ownerOfLand(x, y);
    }
    async getOwnerOfLandMany(parcels) {
        const { x, y } = coordinates_1.coordinates.splitPairs(parcels);
        const contract = this.getLANDRegistryContract();
        return await contract.ownerOfLandMany(x, y);
    }
    async getAssetId(parcel) {
        const contract = this.getLANDRegistryContract();
        return await contract.encodeTokenId(parcel.x, parcel.y);
    }
    toParcelObject(parcelArray) {
        return parcelArray.reduce((map, parcel) => {
            map[parcel.id] = parcel;
            return map;
        }, {});
    }
    getLANDRegistryContract() {
        return decentraland_eth_1.eth.getContract('LANDRegistry');
    }
}
ParcelService.CURRENT_DATA_VERSION = 0;
exports.ParcelService = ParcelService;
function skipDuplicateError(error) {
    if (!lib_1.isDuplicatedConstraintError(error))
        throw new Error(error);
}
//# sourceMappingURL=Parcel.service.js.map