'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');
const Vegi = require('./vegi.js');

class VegiList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.veginet.vegitype');
        this.use(Vegi);
    }

    async addVegi(vegi) {
        return this.addState(vegi);
    }

    async getVegi(vegiKey) {
        return this.getState(vegiKey);
    }

    async updateVegi(vegi) {
        return this.updateState(vegi);
    }
}

module.exports = VegiList;