const State = require('./State.js');

class NotaryLog extends State {

    constructor(participantId, timestamp, type, logText) {
        super('NotaryLog');
        this.setParticipantId(participantId)
        this.setId('');
        this.setTimestamp(timestamp);
        this.setType(type);
        this.setLogText(logText);
    }

    getParticipantId() {
        return this.participantId;
    }

    getId() {
        return this.id;
    }

    getTimestamp() {
        return this.timestamp;
    }

    getType() {
        return this.type;
    }

    getLogText() {
        return this.text;
    }

    setId(id) {
        this.id = id;
    }

    setParticipantId(participantId) {
        this.participantId = participantId;
    }


    setTimestamp(timestamp) {
        this.timestamp = timestamp;
    }

    setType(type) {
        this.type = type;
    }

    setLogText(text) {
        this.text = text;
    }

    static deserialize(buffer) {
        const values = JSON.parse(buffer.toString());
        const notaryLog = new NotaryLog();
        Object.assign(notaryLog, values);
        return notaryLog;
    }

}

module.exports = NotaryLog;
