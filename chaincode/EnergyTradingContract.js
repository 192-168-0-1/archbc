'use strict';

// Energy unit: kilowatt-hour (kWh)

const {Contract} = require('fabric-contract-api');
const EnergyTrading = require("./models/EnergyTrading");
const Participant = require("./models/Participant");

class EnergyTradingContract extends Contract{

  async initLedger(ctx) {
      console.info('============= START : Initialize Ledger ===========');
      const assets = [
          new EnergyTrading('Participant1', 'Asset1', 'Producer1', 'Solar', 100),
          new EnergyTrading('Participant2', 'Asset2', 'Producer2', 'Wind', 300),
      ];

      for (let i = 0; i < assets.length; i++) {
          await ctx.stub.putState('ASSET' + i, assets[i].serialize());
          console.info('Added <--> ', assets[i]);
      }
      console.info('============= END : Initialize Ledger ===========');
  }

  async queryAsset(ctx, assetNumber) {
      const assetAsBytes = await ctx.stub.getState(assetNumber);
      if (!assetAsBytes || assetAsBytes.length === 0) {
          throw new Error(`${assetNumber} does not exist`);
      }
      const asset = EnergyTrading.deserialize(assetAsBytes);
      console.log(asset);
      return asset;
  }

  async createAsset(ctx, participantId, id, producer, energyType, units) {
      console.info('============= START : Create Asset ===========');

      const asset = new EnergyTrading(participantId, id, producer, energyType, units);

      await ctx.stub.putState(id, asset.serialize());
      console.info('============= END : Create Asset ===========');
  }

  async tradeEnergy(ctx, buyingAssetNumber, sellingAssetNumber, units) {
      console.info('============= START : Trading Energy ===========');

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

      buyingAsset.setUnits(buyingAsset.getUnits() + units);
      sellingAsset.setUnits(sellingAsset.getUnits() - units);

      await ctx.stub.putState(buyingAssetNumber, buyingAsset.serialize());
      await ctx.stub.putState(sellingAssetNumber, sellingAsset.serialize());
      console.info('============= END : Trading Energy ===========');
  }

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
}
module.exports = EnergyTradingContract;
