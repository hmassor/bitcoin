'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');
const VegiGrower = require('./vegigrower.js');

class VegiGrowerList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.veginet.vegigrower');
        this.use(VegiGrower);
    }

    async addVegiGrower(vegiGrower) {
        return this.addState(vegiGrower);
    }

    async getVegiGrower(vegiGrowerKey) {
        return this.getState(vegiGrowerKey);
    }

    async updateVegiGrower(vegiGrower) {
        return this.updateState(vegiGrower);
    }
}

module.exports = VegiGrowerList;