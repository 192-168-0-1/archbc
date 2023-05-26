'use strict';

const notaryContract = require('./notary-contract');
const policyContract = require('./policy-contract');
const identityContract = require('./identity-contract');

module.exports.contracts = [notaryContract, policyContract, identityContract];