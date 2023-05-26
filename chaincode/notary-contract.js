/*
 * Chaincode for the money transfer use case
 *
 * Author: MFK
 *
 * disclaimer: fabric-examples were used as a basis for building this code
 */

'use strict';

const {Contract} = require('fabric-contract-api');
const NotaryLog = require("./models/NotaryLog");

class NotaryContract extends Contract {

    async initLedger(ctx) {
        console.log('Init ledger called');
    }

    async addNotaryLog(ctx, logId, participantId,timestamp,type,logText) {
        let notaryLog = new NotaryLog(participantId, timestamp, type, logText);

        let notaryLogExists = await this.assetExists(ctx, logId);

        if (notaryLogExists) {
            throw new Error(`Notary log with id ${logId} already exists`);
        }

        notaryLog.id = logId;

        await ctx.stub.putState(logId, notaryLog.serialise());

        return JSON.stringify(notaryLog);
    }

    async getNotaryLog(ctx, id) {
        const notaryLogBytes = await ctx.stub.getState(id);
        if (!notaryLogBytes || notaryLogBytes.length === 0) {
            throw new Error(`Notary log with key ${key} does not exist`);
        }
        const notaryLog = NotaryLog.deserialize(notaryLogBytes);
        return JSON.stringify(notaryLog);
    }

    async getAllNotaryLogs(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                const key = res.value.key;
                let record;
                try {
                    record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    record = res.value.value.toString('utf8');
                }
                allResults.push({ key, record });
            }

            if (res.done) {
                await iterator.close();
                return JSON.stringify(allResults);
            }
        }
    }

    /**
     *
     * assetExists
     *
     * Checks to see if a key exists in the world state.
     * @param assetId - the key of the asset to read
     * @returns boolean indicating if the asset exists or not.
     */
    async assetExists(ctx, assetId) {

        const buffer = await ctx.stub.getState(assetId);
        return (!!buffer && buffer.length > 0);
    }

}

module.exports = NotaryContract;
