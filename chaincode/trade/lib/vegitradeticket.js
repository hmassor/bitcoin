'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

class VegiTradeTicket extends State {

    static counter;

    // receives attributes of obj = {vegiID, boxID, numberOfBoxesTraded, pricePerKilo, kilosPerBox}
    constructor(obj) {
        super(VegiTradeTicket.getClass(), [obj.tradeTicketID]);
        Object.assign(this, obj);
    }

    getTradeTicketID(){
        return this.tradeTicketID;
    }

    getVegiID(){
        return this.vegiID;
    }

    setVegiID(newVegiID){
        this.vegiID = newVegiID;
    }

    getBoxID(){
        return this.boxID;
    }

    setBoxID(newBoxID){
        this.boxID = newBoxID;
    }

    getNumberOfBoxesTraded(){
        return this.numberOfBoxesTraded;
    }

    setNumberOfBoxesTraded(newNumberOfBoxesTraded){
        this.numberOfBoxesTraded = newNumberOfBoxesTraded;
    }

    getPricePerKilo(){
        return this.pricePerKilo;
    }

    setPricePerKilo(newPricePerKilo){
        this.pricePerKilo = newPricePerKilo;
    }

    getKilosPerBox(){
        return this.kilosPerBox;
    }

    setKilosPerBox(newKilosPerBox){
        this.kilosPerBox = newKilosPerBox;
    }

    static fromBuffer(buffer) {
        return VegiTradeTicket.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to VegiGrower
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, VegiTradeTicket);
    }

    static createVegiTradeTicketInstance(vegiID, boxID, numberOfBoxesTraded, pricePerKilo, kilosPerBox) {
            let tradeTicketID = "TradeTicket" + ++this.counter;
            let ticketValue = parseFloat(numberOfBoxesTraded) * parseFloat(pricePerKilo) * parseFloat(kilosPerBox);
            return new VegiTradeTicket({tradeTicketID, vegiID, boxID, numberOfBoxesTraded, pricePerKilo, ticketValue});
        }

    static getClass() {
        return 'org.veginet.vegitradeticket';
    }
}

module.exports = VegiTradeTicket;