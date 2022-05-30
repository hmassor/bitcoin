'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

const currentStates = {
    REQUEST_ACCEPTED: 'REQUEST_ACCEPTED',        // Initial state if the request was accepted but the cargo has not been picked up yet
    CARGO_UNDERWAY: 'CARGO_UNDERWAY',               // State if logistic company (Org3) picks up the cargo order at the sender
    CARGO_DELIVERED: 'CARGO_DELIVERED',             // State if recipient accepts delivery
    CARGO_RETURNED: 'CARGO_RETURNED',         // State if recipient rejects delivery
}

class CargoState extends State {

    // receives attributes of obj = { cargoID }
    constructor(obj) {
        super(CargoState.getClass(), [obj.cargoID]);
        Object.assign(this, obj);
    }

    setCargoID(newCargoID){
        this.cargoID = newCargoID;
    }

    getCargoID(){
        return this.cargoID;
    }

    setCurrentState(newCurrentState){
        this.currentState = newCurrentState;
    }

    getCurrentState(){
        return this.currentState;
    }

    setCheckInDate(newCheckInDate){
        this.checkInDate = newCheckInDate;
    }

    setCheckInTime(newCheckInTime){
        this.checkInTime = newCheckInTime;
    }

    setCheckInConsignerName(newCheckInConsignerName){
        this.checkInConsignerName = newCheckInConsignerName;
    }

    setCurrentLongitude(newCurrentLongitude){
        this.currentLongitude = newCurrentLongitude;
    }

    getCurrentLongitude(){
        return this.currentLongitude;
    }

    setCurrentLatitude(newCurrentLatitude){
        this.currentLatitude = newCurrentLatitude;
    }

    getCurrentLatitude(){
        return this.currentLatitude;
    }


    setDeliveryDate(newDeliveryDate){
        this.deliveryDate = newDeliveryDate;
    }

    setDeliveryTime(newDeliveryTime){
        this.deliveryTime = newDeliveryTime;
    }

    setDeliveryRecipientName(newDeliveryRecipientName){
        this.deliveryRecipientName = newDeliveryRecipientName;
    }

    setDeliveryTooLate(newDeliveryTooLate){
        this.deliveryTooLate = newDeliveryTooLate;
    }

    static fromBuffer(buffer) {
        return CargoState.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to Cargostate
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, CargoState);
    }

    /**
     * Factory method to create a Cargostate object
     */
    static createCargoStateInstance(cargoID) {
        let currentState = currentStates.REQUEST_ACCEPTED;
        let checkInDate = null;
        let checkInTime = null;
        let checkInConsignerName = null;
        let currentLongitude = null;
        let currentLatitude = null;
        let deliveryDate = null;
        let deliveryTime = null;
        let deliveryRecipientName = null;
        let deliveryTooLate = false;
        return new CargoState({ cargoID, currentState, checkInDate, checkInTime,
            checkInConsignerName, currentLongitude, currentLatitude, deliveryDate, deliveryTime,
            deliveryRecipientName, deliveryTooLate });
    }

    static getClass() {
        return 'org.veginet.cargostate';
    }

}

module.exports = CargoState;