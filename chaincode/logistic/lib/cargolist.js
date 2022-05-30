'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');
const Cargo = require('./cargo.js');

class CargoList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.veginet.cargo');
        this.use(Cargo);
    }

    async addCargo(cargo) {
        return this.addState(cargo);
    }

    async getCargo(cargoKey) {
        return this.getState(cargoKey);
    }

    async updateCargo(cargo) {
        return this.updateState(cargo);
    }
}

module.exports = CargoList;