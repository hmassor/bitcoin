'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

class Vegi extends State {

    // receives attributes of obj = {vegiID, vegiType, kilosPerBox}
    constructor(obj) {
        super(Vegi.getClass(), [obj.vegiID]);
        Object.assign(this, obj);
    }

    setVegiID(newVegiID) {
        this.vegiID = newVegiID;
    }

    getVegiID() {
        return this.vegiID;
    }

    setVegiType(newVegiType) {
        this.vegiType = newVegiType;
    }

    getVegiType() {
        return this.vegiType;
    }

    setKilosPerBox(newKilosPerBox) {
        this.kilosPerBox = newKilosPerBox;
    }

    getKilosPerBox() {
        return this.kilosPerBox;
    }

    static fromBuffer(buffer) {
        return Vegi.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to VegiGrower
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Vegi);
    }

    /**
     * Factory method to create a VegiGrower object
     */
    static createVegiInstance(vegiID, vegiType, kilosPerBox) {
        return new Vegi({ vegiID, vegiType, kilosPerBox });
    }

    static getClass() {
        return 'org.veginet.vegitype';
    }
}

module.exports = Vegi;