'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

class VegiStock extends State {

    // receives obj = {vegiBox, numberOfBoxes, owner}  // Important: vegiBox is instance of class VegiBox
    constructor(obj) {
        super(VegiStock.getClass(), [obj.vegiBox.boxID, obj.owner]);
        Object.assign(this, obj);
    }

    setVegiBox(newVegiBox) {
        this.vegiBox = newVegiBox;
    }

    getVegiBox() {
        return this.vegiBox;
    }

    setNumberOfBoxes(newNumberOfBoxes) {
        this.numberOfBoxes = newNumberOfBoxes;
    }

    getNumberOfBoxes() {
        return this.numberOfBoxes;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    getOwner() {
        return this.owner;
    }

    setStockPricePerKilo(newStockPricePerKilo) {
        this.stockPricePerKilo = newStockPricePerKilo;
    }

    getStockPricePerKilo() {
        return this.stockPricePerKilo;
    }

    setPreviousOwner(newPreviousOwner) {
        this.previousOwner = newPreviousOwner;
    }

    getPreviousOwner() {
        return this.previousOwner;
    }

    static fromBuffer(buffer) {
        return VegiStock.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to VegiStock
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, VegiStock);
    }

    /**
     * Factory method to create a VegiStock object
     */
    static createVegiStockInstance(vegiBox, numberOfBoxes, previousOwner, owner, stockPricePerKilo) {     // vegiBox = instance of class VegiBox
        return new VegiStock({ vegiBox, numberOfBoxes, previousOwner, owner, stockPricePerKilo});
    }

    static getClass() {
        return 'org.veginet.vegistock';
    }
}

module.exports = VegiStock;