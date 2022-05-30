'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');
const VegiTradeTicket = require('./vegitradeticket.js');

class VegiTradeTicketList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.veginet.vegitradeticket');
        this.use(VegiTradeTicket);
    }

    async addVegiTradeTicket(vegiTradeTicket) {
        return this.addState(vegiTradeTicket);
    }

    async getVegiTradeTicket(vegiTradeTicketKey) {
        return this.getState(vegiTradeTicketKey);
    }

    async updateVegiTradeTicket(vegiTradeTicket) {
        return this.updateState(vegiTradeTicket);
    }
}

module.exports = VegiTradeTicketList;