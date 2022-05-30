'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');
const VegiStock = require('./vegistock.js');

class VegiStockList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.veginet.vegistock');
        this.use(VegiStock);
    }

    async addVegiStock(vegiStock) {
        return this.addState(vegiStock);
    }

    async getVegiStock(vegiStockKey) {
        return this.getState(vegiStockKey);
    }

    async updateVegiStock(vegiStock) {
        return this.updateState(vegiStock);
    }

    async deleteVegiStock(vegiStockKey){
        return this.deleteState(vegiStockKey);
    }
}

module.exports = VegiStockList;