'use strict';

const { Contract } = require('fabric-contract-api');

class PolicyContract extends Contract {

    async initLedger(ctx) {
        console.log('Initializing Policy Ledger');
        // Add default policies during the initial setup
        // Can be changed later
        const policies = require('.data/policies.js').policies;
        for (const policyId in policies) {
            await ctx.stub.putState(policyId, Buffer.from(JSON.stringify(policies[policyId])));
        }
        console.log('Policy Ledger initialized');
    }

    // why did we add policyJSON here?
    async addPolicy(ctx, policyId, policyJSON) {
        const policy = JSON.parse(policyJSON);
        await ctx.stub.putState(policyId, Buffer.from(JSON.stringify(policy)));
        console.log('Policy added successfully');
    }

    async getPolicy(ctx, policyId) {
        console.info('Querying policy by ID: ' + policyId);
        const policyAsBytes = await ctx.stub.getState(policyId);
        const policy = JSON.parse(policyAsBytes);
        return JSON.stringify(policy);
    }

    async getAllPolicies(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('All data fetched');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
}

module.exports = PolicyContract;
