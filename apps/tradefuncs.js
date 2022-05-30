'use strict';

const { prettyJSONString } = require('../utils/AppUtil.js');


class TradeFunction {

    constructor(contract) {
        this.contract = contract;
    }

    async createVegi(vegiID, vegiType, kilosPerBox) {
        try {
            console.log('\n--> Submit Transaction: CreateVegi, creates vegi with VegiID, VegiType, KilosPerBox');
            let result = await this.contract.submitTransaction('CreateVegi', vegiID, vegiType, kilosPerBox);
            console.log(`*** Result committed: The following vegi was created: ${prettyJSONString(result.toString())}`);
        } catch (e) {
            console.error(`******** FAILED to run createVegi()-Function: ${e}`);
        }
    }

    async createGrower(growerID, growerSurname, growerStreet, growerCity, growerZIP, growerCountry) {
        try {
            console.log('\n--> Submit Transaction: CreateGrower, creates new grower with GrowerID, GrowerSurname, GrowerStreet, GrowerCity, GrowerZIP, GrowerCountry');
            let result = await this.contract.submitTransaction('CreateGrower', growerID, growerSurname, growerStreet, growerCity, growerZIP, growerCountry);
            console.log(`*** Result committed: The following vegi grower was created: ${prettyJSONString(result.toString())}`);
        }
        catch (e) {
            console.error(`******** FAILED to run createGrower()-Function: ${e}`);
        }
    }

    async createOwner(mspOrg, orgUserId, ownerSurname, ownerStreet, ownerCity, ownerZIP, ownerCountry) {
        try {
            console.log('\n--> Submit Transaction: CreateOwner, creates new owner with OwnerMSP, appUserID, ownerSurname, ownerStreet, ownerCity, ownerZIP, ownerCountry');
            let result = await this.contract.submitTransaction('CreateOwner', mspOrg, orgUserId, ownerSurname, ownerStreet, ownerCity, ownerZIP, ownerCountry);
            console.log(`*** Result committed: The following vegi owner was created: ${prettyJSONString(result.toString())}`);
        } catch (e) {
            console.error(`******** FAILED to run createOwner()-Function: ${e}`);
        }
    }

    async changeOwnerAddress(ownerMSP, appUserID, newOwnerStreet, newOwnerCity, newOwnerZIP, newOwnerCountry) {
        try {
            console.log('\n--> Submit Transaction: ChangeOwnerAddress, changes the address of an existing owner with OwnerMSP, appUserID, ownerStreet, ownerCity, ownerZIP, ownerCountry');
            let result = await this.contract.submitTransaction('ChangeOwnerAddress',ownerMSP, appUserID, newOwnerStreet, newOwnerCity, newOwnerZIP, newOwnerCountry);
            console.log(`*** Result committed: The following address was changed: ${prettyJSONString(result.toString())}`);
        } catch (e) {
            console.error(`******** FAILED to run changeOwnerAddress()-Function: ${e}`);
        }
    }

    async createStock(growerID, boxID, vegiID, stockPricePerKilo, harvestDate, numberOfBoxes,  previousOwnerAppUserID, newOwnerAppUserID, stockExistsFlag) {
        try {
            console.log('\n--> Submit Transaction: CreateStock, creates new stock with GrowerID, BoxID, VegiID, PricePerKilo, HarvestDate, NumberOfBoxes, PreviousOwnerID, NewOwnerID, StockExistsFlag');
            let result = await this.contract.submitTransaction('CreateStock', growerID, boxID, vegiID, stockPricePerKilo, harvestDate, numberOfBoxes,  previousOwnerAppUserID, newOwnerAppUserID, stockExistsFlag);
            console.log(`*** Result committed: The following vegi stock was created: ${prettyJSONString(result.toString())}`);
        } catch (e) {
            console.error(`******** FAILED to run createStock()-Function: ${e}`);
        }
    }

    async whatIsOnStock(sellerAppUserID) {
        try {
            console.log('\n--> Evaluate Transaction: WhatIsOnStock()-function returns the stock at Org4 (Vegi-Seller) for the given vegiID');
            let result = await this.contract.evaluateTransaction('WhatIsOnStock', sellerAppUserID);
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);
            var firstElement = eval(result.toString());
            return firstElement;
        } catch (e) {
            console.error(`******** FAILED to run queryGrower()-Function: ${e}`);
        }
    }

    async changeStockQuantity(boxID, appUserID, newNumberOfBoxes) {
        try {
            console.log('\n--> Submit Transaction: ChangeStockQuantity()-function changes the number of boxes in stock at Org4 (Vegi-Seller)');
            let result = await this.contract.submitTransaction('ChangeStockQuantity', boxID, appUserID, newNumberOfBoxes);
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);
        } catch (e) {
            console.error(`******** FAILED to run changeStockQuantity()-Function: ${e}`);
        }
    }

    async changeStockPrice(boxID, appUserID, newStockPricePerKilo) {
        try {
            console.log('\n--> Submit Transaction: ChangeStockPrice()-function changes the price of the boxes in stock at Org4 (Vegi-Seller)');
            let result = await this.contract.submitTransaction('ChangeStockPrice', boxID, appUserID, newStockPricePerKilo);
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);
        } catch (e) {
            console.error(`******** FAILED to run changeStockQuantity()-Function: ${e}`);
        }
    }


    async buyStock(boxID, currentOwnerID, newOwnerID, numberOfBoxesTraded) {
        try {
            console.log('\n--> Submit Transaction: SellStock: BoxID, CurrentOwnerID, NewOwnerID, NumberOfBoxesTraded, PricePerKilo');
            let result = await this.contract.submitTransaction('BuyStock', boxID, currentOwnerID, newOwnerID, numberOfBoxesTraded);
            console.log(`*** Result committed: The following is the new holding of the Buyer: ${prettyJSONString(result.toString())}`);
        } catch (e) {
            console.error(`******** FAILED to run sellStock()-Function: ${e}`);
        }
    }

    async showGrower(growerID) {
        try {
            console.log('\n--> Evaluate Transaction: queryGrower()-function returns all grower details for the given growerName');
            let result = await this.contract.evaluateTransaction('queryGrower', growerID);
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);
            var firstElement = eval(result.toString())[0];
            return firstElement;
        } catch (e) {
            console.error(`******** FAILED to run queryGrower()-Function: ${e}`);
        }
    }

    async showGrowerZIP(growerZIP) {
        try {
            console.log('\n--> Evaluate Transaction: queryGrowerZIP()-function returns all growers for the given growerZIP');
            let result = await this.contract.evaluateTransaction('queryGrowerZIP', growerZIP);
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);
            var firstElement = eval(result.toString());
            return firstElement;
        } catch (e) {
            console.error(`******** FAILED to run queryGrowerZIP()-Function: ${e}`);
        }
    }

    async showOwner(appUserId) {
        try {
            console.log('\n--> Evaluate Transaction: showOwner() returns the owner for the given appUserID');
            let result = await this.contract.evaluateTransaction('queryOwner', appUserId);
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);
            var firstElement = eval(result.toString())[0];
            return firstElement;
        } catch (e) {
            console.error(`******** FAILED to run queryOwner()-Function: ${e}`);
        }
    }

    async showStockHistory(boxID, appUserId) {
        try {
            console.log('\n--> Evaluate Transaction: queryHistory, function returns the history of owned vegi boxes for the provided boxID and owner');
            let result = await this.contract.evaluateTransaction('queryHistory', boxID, appUserId);
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);
            var firstElement = eval(result.toString());
            return firstElement;
        } catch (e) {
            console.error(`******** FAILED to run queryHistory()-Function: ${e}`);
        }
    }

    async showTradeTicket(tradeTicketID) {
        try {
            console.log('\n--> Evaluate Transaction: queryTradeTicket()-function returns the details of the trade for the given TradeTicketID');
            let result = await this.contract.evaluateTransaction('queryTradeTicket', tradeTicketID);
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);
            var firstElement = eval(result.toString())[0];
            return firstElement;
        } catch (e) {
            console.error(`******** FAILED to run queryTradeTicket()-Function: ${e}`);
        }
    }

    async showVegi(vegiID) {
        try {
            console.log('\n--> Evaluate Transaction: queryTradeTicket()-function returns the vegi details for the given vegiID');
            let result = await this.contract.evaluateTransaction('queryVegi', vegiID);
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            var json = eval(result.toString());
            let length = json.length;
            console.log(length);
            var lastElement = json[length-1];
            return lastElement;
        } catch (e) {
            console.error(`******** FAILED to run queryVegi()-Function: ${e}`);
        }
    }
}

module.exports = TradeFunction;