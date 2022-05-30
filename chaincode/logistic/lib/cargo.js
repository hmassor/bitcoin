'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');
const CargoState = require('./cargostate.js');

const currentStates = {
    REQUEST_SENT: 'REQUEST_SENT',                 // Initial state if request is sent
    REQUEST_REJECTED: 'REQUEST_REJECTED',         // State if logistic company (Org3) rejects the cargo order
}


class Cargo extends State {

    static counter;

    // receives attributes of obj = {cargoID, tradeTicketID, originAppUserID, originData, destinationAppUserID,
    //             destinationData, cargoWeight, cargoPrice, cargoState, promisedArrivalDate }
    constructor(obj) {
        super(Cargo.getClass(), [obj.tradeTicketID, obj.cargoID]);
        Object.assign(this, obj);
    }

    setCargoID(newCargoID) {
        this.cargoID = newCargoID;
    }

    getCargoID() {
        return this.cargoID;
    }

    setTradeTicketID(newTradeTicketID){
        this.tradeTicketID = newTradeTicketID;
    }

    getTradeTicketID(){
        return this.tradeTicketID;
    }

    setOriginData(newOriginData) {
        this.originData = newOriginData;
    }

    getOriginData() {
        return this.originData;
    }

    setDestinationData(newDestinationData) {
        this.destinationData = newDestinationData;
    }

    getDestinationData() {
        return this.destinationData;
    }

    setCargoWeight(newCargoWeight){
        this.cargoWeight = newCargoWeight;
    }

    getCargoWeight(){
        return this.cargoWeight;
    }

    setCargoPrice(newCargoPrice){
        this.cargoPrice = newCargoPrice;
    }

    setCargoState(newCargoState){
        this.cargoState = newCargoState;
    }

    getCargoState(){
        return this.cargoState;
    }

    setPromisedArrivalDate(newPromisedArrivalDate) {
        this.promisedArrivalDate = newPromisedArrivalDate;
    }

    getPromisedArrivalDate() {
        return this.promisedArrivalDate;
    }


    static fromBuffer(buffer) {
        return Cargo.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to Cargo
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Cargo);
    }

    /**
     * Factory method to create a Cargo object
     */
    static createCargoInstance(originAppUserID, originData, destinationAppUserID, destinationData, tradeTicketID, boxID,
        numberOfBoxes, kilosPerBox) {
        let cargoID = 'Cargo' + ++this.counter;
        let cargoWeight = parseInt(numberOfBoxes) * parseFloat(kilosPerBox);
        let cargoPrice = null;
        let cargoState = currentStates.REQUEST_SENT;
        let promisedArrivalDate = null;
        return new Cargo({cargoID,tradeTicketID,originAppUserID,originData,destinationAppUserID,destinationData,
            cargoWeight,cargoPrice,cargoState,promisedArrivalDate});
    }

    static getClass() {
        return 'org.veginet.cargo';
    }

}

module.exports = Cargo;