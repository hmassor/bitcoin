'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

class LogClient extends State {

    // receives attributes of obj = {logClientAppUserID, logClientSurname, logClientStreet, logClientCity, logClientZIP, logClientCountry }
    constructor(obj) {
        super(LogClient.getClass(), [obj.logClientAppUserID]);
        Object.assign(this, obj);
    }

    setLogClientUserID(newLogClientAppUserID){
        this.logClientAppUserID = newLogClientAppUserID;
    }

    getLogClientAppUserID() {
        return this.logClientAppUserID;
    }


    setLogClientSurname(newLogClientSurname) {
        this.logClientSurname = newLogClientSurname;
    }

    getLogClientSurname() {
        return this.logClientSurname;
    }


    setLogClientMSP(newLogClientMSP) {
        this.logClientMSP = newLogClientMSP;
    }

    getLogClientMSP() {
        return this.logClientMSP;
    }

    setLogClientStreet(newLogClientStreet) {
        this.logClientStreet = newLogClientStreet;
    }

    getLogClientStreet() {
        return this.logClientStreet;
    }


    setLogClientZIP(newLogClientZIP) {
        this.logClientZIP = newLogClientZIP;
    }

    getLogClientZIP() {
        return this.logClientZIP;
    }

    setLogClientCity(newLogClientCity) {
        this.logClientCity = newLogClientCity;
    }

    getLogClientCity() {
        return this.logClientCity;
    }

    setLogClientCountry(newLogClientCountry) {
        this.logClientCountry = newLogClientCountry;
    }

    getLogClientCountry() {
        return this.logClientCountry;
    }

    static fromBuffer(buffer) {
        return LogClient.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to LogClient
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, LogClient);
    }

    /**
     * Factory method to create an LogClient object
     */
    static createLogClientInstance(logClientAppUserID, logClientSurname, logClientStreet, logClientCity, logClientZIP, logClientCountry) {
        return new LogClient({logClientAppUserID,logClientSurname,logClientStreet,logClientCity,logClientZIP,logClientCountry });
    }

    static getClass() {
        return 'org.veginet.logclient';
    }

}

module.exports = LogClient;