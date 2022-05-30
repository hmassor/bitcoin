'use strict';

const State = require('../ledger-api/state.js');

// Query Class for query functions such as history etc
class LogQuery {

    // Here the respective namespace has to be passed ->  "org.veginet.logclient", "org.veginet.cargo", or "org.veginet.logclient.cargolist"
    constructor(ctx, listName) {
        this.ctx = ctx;
        this.name = listName;
    }

    /**
     * Get CargoState History for a specified cargoID.
     * @param {String} cargoID
     */
    async getCargoStateHistory(cargoID) {
        let ledgerKey = await this.ctx.stub.createCompositeKey(this.name, [cargoID]);
        const resultsIterator = await this.ctx.stub.getHistoryForKey(ledgerKey);
        return await this.getAllResults(resultsIterator, true);
    }

    async getCargoHistory(tradeTicketID, cargoID) {
        let ledgerKey = await this.ctx.stub.createCompositeKey(this.name, [tradeTicketID, cargoID]);
        const resultsIterator = await this.ctx.stub.getHistoryForKey(ledgerKey);
        return await this.getAllResults(resultsIterator, true);
    }


    /**
     * queryOwner of a box
     * @param someID
     */
    async queryKeyByFirstPartOfKey(someID) {
        if (arguments.length < 1) {
            throw new Error('Incorrect number of arguments. Expecting 1');
        }
        // ie namespace + owner + vegiBox.boxID eg
        // "Key":"org.veginet.vegistockBox1SamOwner"   (Box2, etc)
        // "Partial":'org.veginet.vegistockBox1"'  (using partial key, find owner "WaltOwner", "SamOwner" etc)
        const resultsIterator = await this.ctx.stub.getStateByPartialCompositeKey(this.name, [someID]);
        let method = this.getAllResults;
        return await method(resultsIterator, false);
    }

    /**
     * queryKeyByOwner
     * @param {String} attribute
     * @param {String} attributeValue
     */
    async queryByAttribute(attribute, attributeValue) {
        //
        let self = this;
        if (arguments.length < 1) {
            throw new Error('Incorrect number of arguments. Expecting owner name.');
        }
        let queryString = {};
        queryString.selector = {};
        queryString.selector[attribute] = attributeValue;
        let method = self.getQueryResultForQueryString;
        return await method(this.ctx, self, JSON.stringify(queryString));
    }

    /**
    * query By AdHoc string
    * @param {String} queryString actual query string (escaped)
    */
    async queryByAdhoc(queryString) {

        if (arguments.length < 1) {
            throw new Error('Incorrect number of arguments. Expecting ad-hoc string, which gets stringified for mango query');
        }
        let self = this;

        if (!queryString) {
            throw new Error('queryString must not be empty');
        }
        let method = self.getQueryResultForQueryString;
        let queryResults = await method(this.ctx, self, JSON.stringify(queryString));
        return queryResults;
    }

    /**
     * Function getQueryResultForQueryString
     * @param {Context} ctx the transaction context
     * @param {any}  self within scope passed in
     * @param {String} the query string created prior to calling this fn
    */
    async getQueryResultForQueryString(ctx, self, queryString) {
        const resultsIterator = await ctx.stub.getQueryResult(queryString);
        let results = await self.getAllResults(resultsIterator, false);

        return results;

    }

    /**
     * Function getAllResults
     * @param {resultsIterator} iterator within scope passed in
     * @param {Boolean} isHistory query string created prior to calling this fn
    */
    async getAllResults(iterator, isHistory) {
        let allResults = [];
        let res = { done: false, value: null };

        while (true) {
            res = await iterator.next();
            let jsonRes = {};
            if (res.value && res.value.value.toString()) {
                if (isHistory && isHistory === true) {
                    //jsonRes.TxId = res.value.tx_id;
                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    jsonRes.Timestamp = new Date((res.value.timestamp.seconds.low * 1000));
                    let ms = res.value.timestamp.nanos / 1000000;
                    jsonRes.Timestamp.setMilliseconds(ms);
                    if (res.value.is_delete) {
                        jsonRes.IsDelete = res.value.is_delete.toString();
                    } else {
                        try {
                            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));

                        } catch (err) {
                            console.log(err);
                            jsonRes.Value = res.value.value.toString('utf8');
                        }
                    }
                } else { // non history query ..
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            // check to see if we have reached the end
            if (res.done) {
                // explicitly close the iterator
                console.log('iterator is done');
                await iterator.close();
                return allResults;
            }

        }  // while true
    }
}
module.exports = LogQuery;
