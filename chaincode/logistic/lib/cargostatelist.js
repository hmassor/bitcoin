'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');
const CargoState = require('./cargostate.js');

class CargoStateList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.veginet.cargostate');
        this.use(CargoState);
    }

    async addCargoState(cargoState) {
        return this.addState(cargoState);
    }

    async getCargoState(cargoStateKey) {
        return this.getState(cargoStateKey);
    }

    async updateCargoState(cargoState) {
        return this.updateState(cargoState);
    }
}

module.exports = CargoStateList;