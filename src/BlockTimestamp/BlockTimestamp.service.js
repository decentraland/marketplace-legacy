"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decentraland_eth_1 = require("decentraland-eth");
const BlockTimestamp_model_1 = require("./BlockTimestamp.model");
class BlockTimestampService {
    constructor() {
        this.BlockTimestamp = BlockTimestamp_model_1.BlockTimestamp;
    }
    async getBlockTime(blockNumber) {
        let timestamp = await BlockTimestamp_model_1.BlockTimestamp.findTimestamp(blockNumber);
        if (!timestamp) {
            timestamp = await this.getBlockchainTimestamp(blockNumber);
            this.insertTimestamp(blockNumber, timestamp);
        }
        return timestamp;
    }
    // TODO: Move to decentraland-eth
    getBlockchainTimestamp(blockNumber) {
        const web3 = decentraland_eth_1.eth.wallet.getWeb3();
        return new Promise((resolve, reject) => {
            web3.eth.getBlock(blockNumber, (error, block) => {
                if (error || !block) {
                    reject(error);
                }
                else {
                    resolve(block.timestamp * 1000);
                }
            });
        });
    }
    insertTimestamp(blockNumber, timestamp) {
        // Cache for later
        return BlockTimestamp_model_1.BlockTimestamp.insert({
            block_number: blockNumber,
            timestamp
        }).catch(() => {
            // Don't do anything
        });
    }
}
exports.BlockTimestampService = BlockTimestampService;
//# sourceMappingURL=BlockTimestamp.service.js.map