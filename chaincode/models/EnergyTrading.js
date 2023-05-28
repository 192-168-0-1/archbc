const State = require('./State.js');

class EnergyTrading extends State{
      // constructor
      constructor(participantId, id, producer, energyType, units) {
          super('EnergyTrading');
          this.setParticipantId(participantId)
          this.setId(id);
          this.setProducer(producer);
          this.setEnergyType(energyType);
          this.setUnits(units);
      }

      // getters and setters
      getParticipantId() {
          return this.participantId;
      }

      setParticipantId(participantId) {
          this.participantId = participantId;
      }

      getId() {
          return this.id;
      }

      setId(id) {
          this.id = id;
      }

      getProducer() {
          return this.producer;
      }

      setProducer(producer) {
          this.producer = producer;
      }

      getEnergyType() {
          return this.energyType;
      }

      setEnergyType(energyType) {
          this.energyType = energyType;
      }

      getUnits() {
          return this.units;
      }

      setUnits(units) {
          this.units = units;
      }

      static deserialize(buffer) {
          const values = JSON.parse(buffer.toString());
          const energyTrading = new EnergyTrading();
          Object.assign(energyTrading, values);
          return energyTrading;
      }
}

module.exports = EnergyTrading;
