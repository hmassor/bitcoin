'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');
const LogClient = require('./logclient.js');

class LogClientlist extends StateList {

    constructor(ctx) {
        super(ctx, 'org.veginet.logclient');
        this.use(LogClient);
    }

    async addLogClient(logClient) {
        return this.addState(logClient);
    }

    async getLogClient(logClientKey) {
        return this.getState(logClientKey);
    }

    async updateLogClient(logClient) {
        return this.updateState(logClient);
    }
}

module.exports = LogClientlist;