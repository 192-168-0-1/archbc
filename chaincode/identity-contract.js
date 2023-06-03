'use strict';

const { Contract } = require('fabric-contract-api');
const Participant = require("./models/Participant");
const Role = require('./enum/role');

class IdentityContract extends Contract {
    /**
     * Utility function checking if a user is an admin
     * @param {*} idString - the identity object
     */
    isAdmin(identity) {
        var match = identity.getID().match('.*CN=(.*)::');
        return match !== null && match[1] === 'admin';
    }

    /**
     * Utility function to get the id of the participant
     * @param {*} id - the id of the participant
     */
    getParticipantId(identity) {
        return identity.getAttributeValue('id');
    }

    getParticipantRole(identity) {
        return identity.getAttributeValue('role');
    }

    isRoleValid(role) {
        if (role !== Role.AMDEX_ADMIN && role !== Role.DATA_OFFICER && role !== Role.DATA_SCIENTIST) {
            return false;
        }
        return true;
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

    /**
     * Create Participant
     *
     * This transaction is started by the participant during sign-up
     *
     * @param id - The participant identifier
     * @param name - The participant name
     * @param role - The role of the participant
     * @returns the newly created participant
     */
    async createParticipant(ctx, id, name, role) {

        let identity = ctx.clientIdentity;

        if (!this.isRoleValid(role)) {
            throw new Error(`The specified role is not valid, please enter a correct one. Valid roles are:
            ${Role.AMDEX_ADMIN}, ${Role.DATA_OFFICER}, ${Role.DATA_SCIENTIST}`);
        }

        if (!this.isAdmin(identity)) {
            throw new Error(`Only administrators can create participants`);
        }

        // Generate a participant representation
        let participant = new Participant(id, name, role);

        // generate the key for the participant
        let key = participant.getType() + ":" + participant.getId();

        // check if the participant already exists
        let exists = await this.assetExists(ctx, key);

        if (exists) {
            throw new Error(`Participant with id ${key} already exists`);
        }

        // update state with new participant
        await ctx.stub.putState(key, participant.serialise())

        // Return the new participant
        return JSON.stringify(participant);
    }


    /**
     * Get participant
     *
     * This transaction is started by the farmer that collected eggs
     * and stored them in a box
     *
     * @param id - The participant identifier
     * @returns the participant
     */
    async getParticipant(ctx, id) {
        let identity = ctx.clientIdentity;

        console.log(this.getParticipantRole(identity))

        if (!id === this.getParticipantId(identity) && !this.isAdmin(identity)) {
            throw new Error(`Only administrators can query other participants. Regular participants can get information of their own account`);
        }

        // get participant
        const buffer = await ctx.stub.getState('Participant:'+id);

        // if participant was not found
        if (!buffer || buffer.length == 0) {
            throw new Error(`Participant with id ${id} was not found`);
        }

        // get object from buffer
        const participant = Participant.deserialise(buffer);
        // Return the participant
        return JSON.stringify(participant);
    }

    async updateParticipantRole(ctx, participantId, role) {
        let identity = ctx.clientIdentity;

        if (!this.isRoleValid(role)) {
            throw new Error(`The specified role is not valid, please enter a correct one. Valid roles are:
            ${Role.AMDEX_ADMIN}, ${Role.DATA_OFFICER}, ${Role.DATA_SCIENTIST}`);
        }

        if (!this.isAdmin(identity)) {
            throw new Error('Only administrators can update the role of other participants.');
        }

        const buffer = await ctx.stub.getState(`Participant:${participantId}`);

        // if participant was not found
        if (!buffer || buffer.length == 0) {
            throw new Error(`Participant with id ${participantId} was not found`);
        }

        const participant = Participant.deserialise(buffer);

        participant.setRole(role);

        await ctx.stub.putState(`${participant.getType()}:${participantId}`, participant.serialise());

        return "ok";
    }
}

module.exports = IdentityContract;
