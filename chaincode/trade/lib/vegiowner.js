'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

class VegiOwner extends State {

    // receives attributes of obj = {ownerMSP, appUserID, ownerSurname, ownerStreet, ownerCity, ownerZIP, ownerCountry}
    constructor(obj) {
        super(VegiOwner.getClass(), [obj.appUserID]);
        Object.assign(this, obj);
    }

    setOwnerSurname(newOwnerSurname) {
        this.ownerSurname = newOwnerSurname;
    }

    getOwnerSurname() {
        return this.ownerSurname;
    }

    setOwnerStreet(newOwnerStreet) {
        this.ownerStreet = newOwnerStreet;
    }

    getOwnerStreet() {
        return this.ownerStreet;
    }

    setOwnerCity(newOwnerCity) {
        this.ownerCity = newOwnerCity;
    }

    getOwnerCity() {
        return this.ownerCity;
    }

    setOwnerZIP(newOwnerZIP) {
        this.ownerZIP = newOwnerZIP;
    }

    getOwnerZIP() {
        return this.ownerZIP;
    }

    setOwnerCountry(newOwnerCountry) {
        this.ownerCountry = newOwnerCountry;
    }

    getOwnerCountry() {
        return this.ownerCountry;
    }

    setOwnerMSP(newOwnerMSP) {
        this.ownerMSP = newOwnerMSP;
    }

    getOwnerMSP() {
        return this.ownerMSP;
    }

    setAppUserID(newAppUserID) {
        this.appUserID = newAppUserID;
    }

    getAppUserID() {
        return this.appUserID;
    }

    checkOwnerMSP(ownerMSP) {
        return this.ownerMSP === ownerMSP;
    }

    static fromBuffer(buffer) {
        return VegiOwner.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to VegiGrower
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, VegiOwner);
    }

    /**
     * Factory method to create a VegiGrower object
     */
    static createVegiOwnerInstance(ownerMSP, appUserID, ownerSurname, ownerStreet, ownerCity, ownerZIP, ownerCountry) {
        return new VegiOwner({ownerMSP,appUserID,ownerSurname,ownerStreet,ownerCity,ownerZIP,ownerCountry});
    }

    static getClass() {
        return 'org.veginet.vegiowner';
    }
}

module.exports = VegiOwner;