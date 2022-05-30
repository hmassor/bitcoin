'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');
const VegiOwner = require('./vegiowner.js');

class VegiOwnerList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.veginet.vegiowner');
        this.use(VegiOwner);
    }

    async addVegiOwner(vegiOwner) {
        return this.addState(vegiOwner);
    }

    async getVegiOwner(vegiOwnerKey) {
        return this.getState(vegiOwnerKey);
    }

    async updateVegiOwner(vegiOwner) {
        return this.updateState(vegiOwner);
    }
}

module.exports = VegiOwnerList;