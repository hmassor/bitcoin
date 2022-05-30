'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

class VegiGrower extends State {

    // receives attributes of obj = {GrowerID, GrowerSurname, GrowerStreet, GrowerCity, GrowerZIP, GrowerCountry}
    constructor(obj) {
        super(VegiGrower.getClass(), [obj.growerZIP, obj.growerID]);
        Object.assign(this, obj);
    }

    setGrowerID(newGrowerID) {
        this.growerID = newGrowerID;
    }

    getGrowerID() {
        return this.growerID;
    }

    setGrowerSurname(newGrowerSurname) {
        this.growerSurname = newGrowerSurname;
    }

    getGrowerSurname() {
        return this.growerSurname;
    }

    setGrowerStreet(newGrowerStreet) {
        this.growerStreet = newGrowerStreet;
    }

    getGrowerStreet() {
        return this.growerStreet;
    }

    setGrowerCity(newGrowerCity) {
        this.growerCity = newGrowerCity;
    }

    getGrowerCity() {
        return this.growerCity;
    }

    setGrowerZIP(newGrowerZIP) {
        this.growerZIP = newGrowerZIP;
    }

    getGrowerZIP() {
        return this.growerZIP;
    }

    setGrowerCountry(newGrowerCountry) {
        this.growerCountry = newGrowerCountry;
    }

    getGrowerCountry() {
        return this.growerCountry;
    }

    static fromBuffer(buffer) {
        return VegiGrower.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to VegiGrower
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, VegiGrower);
    }

    /**
     * Factory method to create a VegiGrower object
     */
    static createVegiGrowerInstance(growerID, growerSurname, growerStreet, growerCity, growerZIP, growerCountry) {
        return new VegiGrower({ growerID, growerSurname, growerStreet, growerCity, growerZIP, growerCountry });
    }

    static getClass() {
        return 'org.veginet.vegigrower';
    }
}

module.exports = VegiGrower;