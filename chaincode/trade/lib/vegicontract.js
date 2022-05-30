'use strict';

// Fabric smart contract classes
const {Contract, Context} = require('fabric-contract-api');

const VegiStock = require('./vegistock.js');
const VegiStockList = require('./vegistocklist.js');
const VegiBox = require('./vegibox.js');
const VegiQuery = require('./vegiqueries.js');
const VegiGrower = require('./vegigrower.js');
const VegiGrowerList = require('./vegigrowerlist.js');
const Vegi = require('./vegi.js');
const VegiList = require('./vegilist.js');
const VegiOwner = require('./vegiowner.js');
const VegiOwnerList = require('./vegiownerlist.js');
const VegiTradeTicket = require('./vegitradeticket.js');
const VegiTradeTicketList = require('./vegitradeticketlist.js');

// Set TradeTicketCounter to zero.
VegiTradeTicket.counter = 0;

class VegiStockContext extends Context {
    constructor() {
        super();
        // will be written to the world state db:
        this.vegiStockList = new VegiStockList(this);
        this.vegiGrowerList = new VegiGrowerList(this);
        this.vegiList = new VegiList(this);
        this.vegiOwnerList = new VegiOwnerList(this);
        this.vegiTradeTicketList = new VegiTradeTicketList(this);
    }
}

class VegiContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.veginet.vegistock');
    }

    createContext() {
        return new VegiStockContext();
    }

    async initNetwork() {
        console.log('Initialising network.');
    }

    /**
     * Create vegi owner
     *
     * @param {Context} ctx the transaction context
     * @param {String} ownerMSP
     * @param {String} appUserID
     * @param {String} ownerSurname
     * @param {String} ownerStreet
     * @param {String} ownerCity
     * @param {String} ownerZIP
     * @param {String} ownerCountry
     * */
    async CreateOwner(ctx, ownerMSP, appUserID, ownerSurname, ownerStreet, ownerCity, ownerZIP, ownerCountry) {
        // Check if ownerMSP and MSP from ClientIdentity correspond
        let mspid = ctx.clientIdentity.getMSPID();
        if (ownerMSP !== mspid) {
            throw new Error('\nProvided OwnerMSP ' + ownerMSP + ' does not correspond with clientIdentity.getMSPID ' + mspid + 'Please check!');
        }
        // Check if the owner was already created before
        let allOwners = await this.queryOwner(ctx, appUserID);
        if (allOwners.length !== 0) {
            for (const anOwner of allOwners){
                if (anOwner.Record.appUserID === appUserID){
                    throw new Error('\nThe provided user ' + appUserID + ' does already exist!');
                }
            }
        }
        // create an instance of owner
        let owner = VegiOwner.createVegiOwnerInstance(ownerMSP, appUserID, ownerSurname, ownerStreet, ownerCity, ownerZIP, ownerCountry);
        await ctx.vegiOwnerList.addVegiOwner(owner);
        return owner;
    }

    /**
     * ChangeOwnerAddress()
     *
     * @param {Context} ctx the transaction context
     * @param {String} ownerMSP
     * @param {String} appUserID
     * @param {String} newOwnerStreet
     * @param {String} newOwnerCity
     * @param {String} newOwnerZIP
     * @param {String} newOwnerCountry
     * */
    async ChangeOwnerAddress(ctx, ownerMSP, appUserID, newOwnerStreet, newOwnerCity, newOwnerZIP, newOwnerCountry) {
        // Check if ownerMSP and MSP from ClientIdentity correspond
        let mspid = ctx.clientIdentity.getMSPID();
        if (ownerMSP !== mspid) {
            throw new Error('\nProvided OwnerMSP ' + ownerMSP + ' does not correspond with clientIdentity.getMSPID ' + mspid + 'Please check!');
        }
        // Check if the owner exists
        let allOwners = await this.queryOwner(ctx, appUserID);
        if (allOwners.length !== 0) {
            let ownerSearched = null;
            for (const anOwner of allOwners){
                if (anOwner.Record.appUserID === appUserID){
                    ownerSearched = appUserID;
                }
            }
            if (ownerSearched === null){
                throw new Error('\nProvided owner with appUserID ' + appUserID + ' does not exist!');
            }
        }
        else {
            throw new Error('\nProvided owner with appUserID ' + appUserID + ' does not exist!');
        }
        // Get instance of owner
        let ownerKey = await VegiOwner.makeKey([appUserID]);
        let owner = await ctx.vegiOwnerList.getVegiOwner(ownerKey);

        // Update address data
        await owner.setOwnerStreet(newOwnerStreet);
        await owner.setOwnerCity(newOwnerCity);
        await owner.setOwnerZIP(newOwnerZIP);
        await owner.setOwnerCountry(newOwnerCountry);

        // Update world state
        await ctx.vegiOwnerList.updateVegiOwner(owner);
        return owner;
    }

    /**
     * Create vegi
     *
     * @param {Context} ctx the transaction context
     * @param {String} vegiID
     * @param {String} vegiType
     * @param {Number} kilosPerBox
     * */
    async CreateVegi(ctx, vegiID, vegiType, kilosPerBox) {
        // Check if user is from Org4 (Vegi-Seller) as only the Vegi-Seller can create a vegi instance
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org4MSP') {
            throw new Error('\nUser is from ' + mspid + ' and thus not allowed to create a vegi instance as only Org4 can do so');
        }
        // Check if the vegi was already created before
        let allVegis = await this.queryVegi(ctx, vegiID);
        if (allVegis.length !== 0) {
            for (const aVegi of allVegis){
                if (aVegi.Record.vegiID === vegiID){
                    throw new Error('\nThe provided vegi ' + vegiID + ' does already exist!');
                }
            }
        }
        // create an instance of Vegi
        let vegi = Vegi.createVegiInstance(vegiID, vegiType, kilosPerBox);
        await ctx.vegiList.addVegi(vegi);
        return vegi;
    }

    /**
     * Create vegi grower
     *
     * @param {Context} ctx the transaction context
     * @param {String} GrowerID
     * @param {String} GrowerSurname
     * @param {String} GrowerStreet
     * @param {String} GrowerCity
     * @param {String} GrowerZIP
     * @param {String} GrowerCountry
     * */
    async CreateGrower(ctx, GrowerID, GrowerSurname, GrowerStreet, GrowerCity, GrowerZIP, GrowerCountry) {
        // Check if user is from Org4 (Vegi-Seller) as only the Vegi-Seller can create a grower instance
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org4MSP') {
            throw new Error('\nUser is from ' + mspid + ' and thus not allowed to create a grower instance as only Org4 can do so');
        }
        // Check if the grower was already created before
        let allGrowers = await this.queryGrower(ctx, GrowerID);
        if (allGrowers.length !== 0) {
            for (const aGrower of allGrowers){
                if (aGrower.Record.growerID === GrowerID){
                    throw new Error('\nThe provided grower ' + GrowerID + ' does already exist!');
                }
            }
        }
        // create an instance of vegiGrower
        let vegiGrower = VegiGrower.createVegiGrowerInstance(GrowerID, GrowerSurname, GrowerStreet, GrowerCity, GrowerZIP, GrowerCountry);
        await ctx.vegiGrowerList.addVegiGrower(vegiGrower);
        return vegiGrower;
    }

    /**
     * Create vegi stock (of vegi boxes)
     *
     * @param {Context} ctx the transaction context
     * @param {String} GrowerID
     * @param {String} BoxID
     * @param {String} VegiID
     * @param {Number} StockPricePerKilo
     * @param {String} HarvestDate
     * @param {Number} NumberOfBoxes
     * @param {String} PreviousOwnerAppUserID
     * @param {String} NewOwnerAppUserID
     * @param {String} StockExistsFlag
     * */
    async CreateStock(ctx, GrowerID, BoxID, VegiID, StockPricePerKilo, HarvestDate, NumberOfBoxes, PreviousOwnerAppUserID, NewOwnerAppUserID, StockExistsFlag) {

        // Do or do not check if the vegi stock already exists, according to the flag set
        let doCheckStockExistence = (StockExistsFlag === 'true' || StockExistsFlag === 'True');

        // Check if user is from Org4 (Vegi-Seller) and if flag is set to true as only the Vegi-Seller can create a stock instance at the Org4
        let mspid = ctx.clientIdentity.getMSPID();
        if (doCheckStockExistence && mspid !== 'Org4MSP') {
            throw new Error('\nUser is from ' + mspid + ' and thus not allowed to create a stock instance as only Org4 can do so');
        }

        if (doCheckStockExistence) {
            // Check if BoxID has already been created previously
            let doesStockExist = await this.stockExists(ctx, BoxID);
            if (doesStockExist) {
                throw new Error('\n vegi box with BoxID ' + BoxID + ' has already been created before and cannot be created twice !');
            }
        }

        // Check if the given grower was already created. If not, first create grower using CreateGrower()-Function
        let growers = await this.queryGrower(ctx, GrowerID);
        if (growers.length === 0) {
            throw new Error('\nGrower with GrowerID ' + GrowerID + ' has not yet been created !');
        }

        // Check if the given owner was already created. If not, first create owner using CreateOwner()-Function
        let owners = await this.queryOwner(ctx, NewOwnerAppUserID);
        if (owners.length === 0) {
            throw new Error('\nOwner with userID ' + NewOwnerAppUserID + ' has not yet been created !');
        }

        // Check if the given vegi was already created. If not, first create vegi using CreateVegi()-Function
        let vegis = await this.queryVegi(ctx, VegiID);
        if (vegis.length === 0) {
            throw new Error('\nVegi with VegiID ' + VegiID + ' has not yet been created !');
        }

        // create an instance of vegiBox
        let vegiBox = VegiBox.createVegiBoxInstance(BoxID, VegiID, GrowerID, HarvestDate);

        // create an instance of vegiStock (=>Important: This function via its (VegiStock) class constructor also
        // calls the State-Superclass)
        let vegiStock = VegiStock.createVegiStockInstance(vegiBox, NumberOfBoxes, PreviousOwnerAppUserID, NewOwnerAppUserID, StockPricePerKilo);


        // Add the vegiStock to the list of all similar vegiStocks in the ledger world state
        // Important: This function via its (VegiStockList) class constructor also
        // calls the StateList-Superclass
        await ctx.vegiStockList.addVegiStock(vegiStock);

        // Must return a serialized vegiStock to caller of smart contract
        return vegiStock;
    }


    /**
     * Buy vegi box (stock)
     *
     * @param {Context} ctx the transaction context
     * @param {String} BoxID
     * @param {String} appUserIDOldOwner -> the userID of the app user, i.e. appUserOrg1
     * @param {String} appUserIDNewOwner -> the userID of the app user of the buyer, i.e. appUserOrg2
     * @param {Number} NumberOfBoxesTraded
     * */
    async BuyStock(ctx, BoxID, appUserIDOldOwner, appUserIDNewOwner, NumberOfBoxesTraded) {
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid === 'Org4MSP') {
            throw new Error('\nUser is from ' + mspid + ' and thus not allowed to buy stock as only the buyers (Org1 or Org2) can do so');
        }

        // Check if BoxID has already been created previously.If not, first create vegi stock using CreateStock()-Function
        let stockExists = await this.stockExists(ctx, BoxID);
        if (!stockExists) {
            throw new Error('\n vegi box with BoxID ' + BoxID + ' has not yet been created before and thus cannot be traded !');
        }

        // Check if the new owner was already created. If not, first create owner using CreateOwner()-Function
        let newOwners = await this.queryOwner(ctx, appUserIDNewOwner);
        if (newOwners.length === 0) {
            throw new Error('\nOwner with userID ' + appUserIDNewOwner + ' has not yet been created !');
        }

        // Retrieve the current vegi stock owned by the current owner
        let vegiStockCurrentOwnerKey = await VegiStock.makeKey([BoxID, appUserIDOldOwner]);
        let vegiStockCurrentOwner = await ctx.vegiStockList.getVegiStock(vegiStockCurrentOwnerKey);
        // Validate that current owner DOES indeed own the vegi stock with the given boxID
        let realCurrentOwner = await vegiStockCurrentOwner.getOwner();
        if (realCurrentOwner !== appUserIDOldOwner) {
            throw new Error('\nvegi stock with ID ' + await vegiStockCurrentOwner.getVegiBox().boxID + ' is  owned by ' +
                realCurrentOwner + ' but not by ' + appUserIDOldOwner);
        }

        // Check if the current owner has sufficient number of vegi stock (vegi boxes) for the trade
        let numberOfVegiBoxesOwnedByCurrentOwner = await parseInt(vegiStockCurrentOwner.getNumberOfBoxes());
        if (numberOfVegiBoxesOwnedByCurrentOwner < NumberOfBoxesTraded) {
            throw new Error('\nCurrent owner only has ' + numberOfVegiBoxesOwnedByCurrentOwner + ' vegi boxes ' +
                ' and thus an insufficient number for this intended trade of ' + NumberOfBoxesTraded + ' vegi boxes!');
        }

        // TRADE-TICKET:
        let tradedVegiID = await vegiStockCurrentOwner.getVegiBox().vegiID;
        let tradedVegi = await ctx.vegiList.getVegi(tradedVegiID);
        let tradedVegiKilosPerBox = await tradedVegi.kilosPerBox;
        let tradePricePerKilo = await vegiStockCurrentOwner.getStockPricePerKilo();

        // createVegiTradeTicketInstance(vegiID, boxID, numberOfBoxesTraded, tradedPricePerKilo, kilosPerBox)
        let vegiTradeTicket = VegiTradeTicket.createVegiTradeTicketInstance(tradedVegiID, BoxID, NumberOfBoxesTraded, tradePricePerKilo, tradedVegiKilosPerBox);
        await ctx.vegiTradeTicketList.updateVegiTradeTicket(vegiTradeTicket);

        //  STOCK: Add vegi boxes to stock of buyer
        // Check if the new owner already has vegi stocks with the given boxID, else create new vegi stock
        let vegiStockNewOwnerKey = VegiStock.makeKey([BoxID, appUserIDNewOwner]);
        let vegiStockNewOwner = await ctx.vegiStockList.getVegiStock(vegiStockNewOwnerKey);

        if (vegiStockNewOwner === null) {
            // Create new stock with given boxID and name for new owner. Remember: vegiStock is identified by [boxID, owner]
            // IMPORTANT: The new stock is added to the vegiStockList WITHIN the CreateStock()-Function, thus:
            // updateVegiStock()-Function call is not neccessary here
            vegiStockNewOwner = await this.CreateStock(ctx, vegiStockCurrentOwner.getVegiBox().growerID, vegiStockCurrentOwner.getVegiBox().boxID,
                vegiStockCurrentOwner.getVegiBox().vegiID, tradePricePerKilo, vegiStockCurrentOwner.getVegiBox().harvestDate, NumberOfBoxesTraded,
                appUserIDOldOwner, appUserIDNewOwner, 'false');
        } else {
            let oldNumberOfBoxesNewOwner = await parseInt(vegiStockNewOwner.getNumberOfBoxes());
            let newNumberOfBoxesNewOwner = await (parseInt(oldNumberOfBoxesNewOwner) + parseInt(NumberOfBoxesTraded));
            let stockPricePerKiloOfOldBoxes = await parseFloat(vegiStockNewOwner.getStockPricePerKilo());
            let newStockPricePerKiloAllBoxes = ((parseFloat(tradePricePerKilo) * NumberOfBoxesTraded) +
                (stockPricePerKiloOfOldBoxes * oldNumberOfBoxesNewOwner)) / newNumberOfBoxesNewOwner;

            await vegiStockNewOwner.setNumberOfBoxes(newNumberOfBoxesNewOwner);
            await vegiStockNewOwner.setStockPricePerKilo(newStockPricePerKiloAllBoxes);
            await ctx.vegiStockList.updateVegiStock(vegiStockNewOwner);
        }

        let newNumberOfBoxesCurrentOwner = numberOfVegiBoxesOwnedByCurrentOwner - NumberOfBoxesTraded;
        await vegiStockCurrentOwner.setNumberOfBoxes(newNumberOfBoxesCurrentOwner);
        if (newNumberOfBoxesCurrentOwner === 0) {
            await ctx.vegiStockList.deleteVegiStock(vegiStockCurrentOwnerKey);
        } else {
            // Set new (lower) number of boxes for current owner (seller)
            await ctx.vegiStockList.updateVegiStock(vegiStockCurrentOwner);
        }

        // Here we set an event that a Listener in the apps can listen to
        let currentOwner = await ctx.vegiOwnerList.getVegiOwner(appUserIDOldOwner);
        let newOwner = await ctx.vegiOwnerList.getVegiOwner(appUserIDNewOwner);

        let buyStockEvent = {
            tradeTicketID: vegiTradeTicket.tradeTicketID,
            sellerAppID: appUserIDOldOwner,
            sellerName: await currentOwner.ownerSurname,
            sellerStreet: await currentOwner.ownerStreet,
            sellerZIP: await currentOwner.ownerZIP,
            sellerCity: await currentOwner.ownerCity,
            sellerCountry: await currentOwner.ownerCountry,
            buyerAppID: appUserIDNewOwner,
            buyerName: await newOwner.ownerSurname,
            buyerStreet: await newOwner.ownerStreet,
            buyerZIP: await newOwner.ownerZIP,
            buyerCity: await newOwner.ownerCity,
            buyerCountry: await newOwner.ownerCountry,
            boxID: BoxID,
            numberOfBoxes: NumberOfBoxesTraded,
            kilosPerBox: tradedVegiKilosPerBox,
        };
        ctx.stub.setEvent('buyStockEvent', Buffer.from(JSON.stringify(buyStockEvent)));

        return vegiStockNewOwner;
    }

    async WhatIsOnStock(ctx, sellerAppUserID){
        let query = new VegiQuery(ctx, 'org.veginet.vegistock');
        return await query.queryByAttribute('owner', sellerAppUserID);
    }

    async stockExists(ctx, BoxID) {
        // Check if BoxID has already been created previously
        let query = new VegiQuery(ctx, 'org.veginet.vegistock');
        let results = await query.queryKeyByFirstPartOfKey(BoxID);
        return results.length > 0;
    }

    async queryHistory(ctx, boxID, owner) {
        // Get a key to be used for History query
        let query = new VegiQuery(ctx, 'org.veginet.vegistock');
        return await query.getStockHistory(boxID, owner);
    }

    async queryGrower(ctx, GrowerID) {
        let query = new VegiQuery(ctx, 'org.veginet.vegigrower');
        return await query.queryByAttribute('growerID', GrowerID);
    }

    async queryGrowerZIP(ctx, GrowerZIP) {
        let query = new VegiQuery(ctx, 'org.veginet.vegigrower');
        return await query.queryByAttribute('growerZIP', GrowerZIP);
    }

    async queryVegi(ctx, VegiID) {
        let query = new VegiQuery(ctx, 'org.veginet.vegitype');
        return await query.queryByAttribute('vegiID', VegiID);
    }

    async queryOwner(ctx, appUserID) {
        let query = new VegiQuery(ctx, 'org.veginet.vegiowner');
        return await query.queryByAttribute('appUserID', appUserID);
    }

    async queryTradeTicket(ctx, TradeTicketID) {
        let query = new VegiQuery(ctx, 'org.veginet.vegitradeticket');
        return await query.queryByAttribute('tradeTicketID', TradeTicketID);
    }

    /**
     * ChangeStockQuantity()    -> Changes the number of boxes, if for instance, vegetables in a box go bad
     *
     * @param {Context} ctx the transaction context
     * @param {String} BoxID
     * @param {String} appUserID -> the userID of the app user from Org4, i.e. appUserOrg4
     * @param {Number} newNumberOfBoxes
     * */
    async ChangeStockQuantity(ctx, BoxID, appUserID, newNumberOfBoxes) {
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org4MSP') {
            throw new Error('\nUser is from ' + mspid + ' and thus not allowed to change stock as only the seller (Org4) can do so');
        }

        // Check if the box with the provided BoxID exists.
        let stockExists = await this.stockExists(ctx, BoxID);
        if (!stockExists) {
            throw new Error('\n vegi box with BoxID ' + BoxID + ' has not yet been created before and thus its stock cannot be changed !');
        }

        // Check if the owner exists.
        let allOwners = await this.queryOwner(ctx, appUserID);
        if (allOwners.length === 0) {
            throw new Error('\nOwner with userID ' + appUserID + ' has not yet been created !');
        }

        // Retrieve the current vegi stock owned by the current owner
        let vegiStockCurrentOwnerKey = await VegiStock.makeKey([BoxID, appUserID]);
        let vegiStockCurrentOwner = await ctx.vegiStockList.getVegiStock(vegiStockCurrentOwnerKey);

        // Validate that current owner DOES indeed owns the vegi stock with the given boxID
        let realCurrentOwner = await vegiStockCurrentOwner.getOwner();
        if (realCurrentOwner !== appUserID) {
            throw new Error('\nvegi stock with ID ' + await vegiStockCurrentOwner.getVegiBox().boxID + ' is  owned by ' +
                realCurrentOwner + ' but not by ' + appUserID);
        }

        // Check if the new number of boxes is not negative
        if (newNumberOfBoxes < 0) {
            throw new Error('\nNew number of boxes cannot be negative!');
        }

        // Update number of boxes
        await vegiStockCurrentOwner.setNumberOfBoxes(newNumberOfBoxes);
        if (newNumberOfBoxes === 0) {
            await ctx.vegiStockList.deleteVegiStock(vegiStockCurrentOwnerKey);
        } else {
            // Set new number of boxes for current owner (seller)
            await ctx.vegiStockList.updateVegiStock(vegiStockCurrentOwner);
        }

        return vegiStockCurrentOwner;
    }

    /**
     * ChangeStockPrice()    -> Changes the number of boxes, if for instance, vegetables in a box go bad
     *
     * @param {Context} ctx the transaction context
     * @param {String} BoxID
     * @param {String} appUserID -> the userID of the app user from Org4, i.e. appUserOrg4
     * @param {Number} newStockPricePerKilo
     * */
    async ChangeStockPrice(ctx, BoxID, appUserID, newStockPricePerKilo) {
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org4MSP') {
            throw new Error('\nUser is from ' + mspid + ' and thus not allowed to change stock as only the seller (Org4) can do so');
        }

        // Check if the box with the provided BoxID exists.
        let stockExists = await this.stockExists(ctx, BoxID);
        if (!stockExists) {
            throw new Error('\n vegi box with BoxID ' + BoxID + ' has not yet been created before and thus its stock cannot be changed !');
        }

        // Check if the owner exists.
        let allOwners = await this.queryOwner(ctx, appUserID);
        if (allOwners.length === 0) {
            throw new Error('\nOwner with userID ' + appUserID + ' does not exist !');
        }

        // Retrieve the current vegi stock owned by the current owner
        let vegiStockCurrentOwnerKey = await VegiStock.makeKey([BoxID, appUserID]);
        let vegiStockCurrentOwner = await ctx.vegiStockList.getVegiStock(vegiStockCurrentOwnerKey);
        // Validate that current owner DOES indeed own the vegi stock with the given boxID
        let realCurrentOwner = await vegiStockCurrentOwner.getOwner();
        if (realCurrentOwner !== appUserID) {
            throw new Error('\nvegi stock with ID ' + await vegiStockCurrentOwner.getVegiBox().boxID + ' is  owned by ' +
                realCurrentOwner + ' but not by ' + appUserID);
        }

        // Check if the new stockPricePerKilo is not negative
        if (newStockPricePerKilo < 0) {
            throw new Error('\nStock price per Kilo cannot be negative!');
        }

        // Update stockPricePerKilo
        await vegiStockCurrentOwner.setStockPricePerKilo(newStockPricePerKilo);
        // Update vegiStockList
        await ctx.vegiStockList.updateVegiStock(vegiStockCurrentOwner);

        return vegiStockCurrentOwner;
    }

}

module.exports = VegiContract;
