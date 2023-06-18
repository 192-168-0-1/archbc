'use strict';

const {Contract} = require('fabric-contract-api');
const EnergyTrading = require("./models/EnergyTrading");
const Role = require('./roles/role');

class EnergyTradingContract extends Contract {

    async initLedger(ctx) {
        console.log('Init ledger called');
    }

    getParticipantRole(identity) {
        return identity.getAttributeValue('role');
    }

    async assetExists(ctx, assetId) {
        const buffer = await ctx.stub.getState(assetId);
        return (!!buffer && buffer.length > 0);
    }

    // Create a new Asset
    async createAsset(ctx, participantId, id, producer, energyType, units) {
        console.info('START : Create Asset');

        const asset = new EnergyTrading(participantId, id, producer, energyType, units);
        asset.transactionHistory = [];

        await ctx.stub.putState(id, asset.serialise());
        console.info('END : Create Asset');
    }

    // Trade energy between 2 peers
    async tradeEnergy(ctx, buyerId, buyingAssetNumber, sellerId, sellingAssetNumber, units) {
        console.info('START : Trading Energy');

        const buyingAssetAsBytes = await ctx.stub.getState(buyingAssetNumber);
        const sellingAssetAsBytes = await ctx.stub.getState(sellingAssetNumber);

        if (!buyingAssetAsBytes || buyingAssetAsBytes.length === 0) {
            throw new Error(`${buyingAssetNumber} does not exist`);
        }

        if (!sellingAssetAsBytes || sellingAssetAsBytes.length === 0) {
            throw new Error(`${sellingAssetNumber} does not exist`);
        }

        const buyingAsset = EnergyTrading.deserialize(buyingAssetAsBytes);
        const sellingAsset = EnergyTrading.deserialize(sellingAssetAsBytes);

        if (sellingAsset.getUnits() < units) {
            throw new Error('Not enough energy units for trading');
        }

        // Check permission
        console.log('Seller ID:', sellerId);
        console.log('Selling Asset Participant ID:', sellingAsset.getParticipantId());

        // Check permission
        if (sellingAsset.getParticipantId() !== sellerId) {
            throw new Error('Only the owner of the asset can sell it');
        }

        //Buyer and seller cannot be the same
        if (buyerId === sellerId) {
            throw new Error("Buyer and seller cannot be the same participant.");
        }

        // Update units and transaction history
        buyingAsset.setUnits(buyingAsset.getUnits() + units);
        sellingAsset.setUnits(sellingAsset.getUnits() - units);

        const transaction = {buyerId, sellerId, units, timestamp: new Date().toISOString(), targetAudience: [buyerId, sellerId]};
        buyingAsset.transactionHistory.push(transaction);
        sellingAsset.transactionHistory.push(transaction);

        await ctx.stub.putState(buyingAssetNumber, buyingAsset.serialise());
        await ctx.stub.putState(sellingAssetNumber, sellingAsset.serialise());

        // create a TradeCompleted event
        const eventPayload = Buffer.from(JSON.stringify(transaction));
        ctx.stub.setEvent('TradeCompleted', eventPayload);

        console.info('END : Trading Energy');
    }

    // Get transaction history for a specific asset
    async getTransactionHistory(ctx, assetId) {
        const assetAsBytes = await ctx.stub.getState(assetId);

        if (!assetAsBytes || assetAsBytes.length === 0) {
            throw new Error(`${assetId} does not exist`);
        }

        const asset = EnergyTrading.deserialize(assetAsBytes);

        return asset.getTransactionHistory();
    }

    // Read an asset
    async readAsset(ctx, assetId) {
        console.info('START : Read Asset');

        const assetAsBytes = await ctx.stub.getState(assetId);

        if (!assetAsBytes || assetAsBytes.length === 0) {
            throw new Error(`${assetId} does not exist`);
        }

        const asset = EnergyTrading.deserialize(assetAsBytes);

        console.info('END : Read Asset');

        return asset;
    }

    // Update an asset
    async updateAsset(ctx, assetId, newValues) {
        console.info('START : Update Asset');

        const exists = await this.assetExists(ctx, assetId);
        if (!exists) {
            throw new Error(`The asset ${assetId} does not exist`);
        }

        const assetAsBytes = await ctx.stub.getState(assetId);
        const asset = EnergyTrading.deserialize(assetAsBytes);

        Object.keys(newValues).forEach((key) => {
            asset[key] = newValues[key];
        });

        await ctx.stub.putState(assetId, asset.serialise());

        console.info('END : Update Asset');
    }

    // Delete an asset
    async deleteAsset(ctx, assetId) {
        console.info('START : Delete Asset');

        const exists = await this.assetExists(ctx, assetId);
        if (!exists) {
            throw new Error(`The asset ${assetId} does not exist`);
        }

        await ctx.stub.deleteState(assetId);

        console.info('END : Delete Asset');
    }
}

module.exports = EnergyTradingContract;
