'use strict';

// Fabric smart contract classes
const {Contract, Context} = require('fabric-contract-api');

const LogClient = require('./logclient.js');
const LogClientList = require('./logclientlist.js');
const Cargo = require('./cargo.js');
const CargoList = require('./cargolist.js');
const CargoState = require('./cargostate.js');
const CargoStateList = require('./cargostatelist.js');
const LogQuery = require('./logqueries.js');

// Set CargoCounter to zero.
Cargo.counter = 0;


const currentStates = {
    REQUEST_SENT: 'REQUEST_SENT',                 // Initial state if request is sent
    REQUEST_REJECTED: 'REQUEST_REJECTED',         // State if logistic company (Org3) rejects the cargo order
    REQUEST_ACCEPTED: 'REQUEST_ACCEPTED',        // Initial state if the request was accepted but the cargo has not been picked up yet
    CARGO_UNDERWAY: 'CARGO_UNDERWAY',               // State if logistic company (Org3) picks up the cargo order at the sender
    CARGO_DELIVERED: 'CARGO_DELIVERED',             // State if recipient accepts delivery
}


class LogisticContext extends Context {
    constructor() {
        super();
        // will be written to the world state db:
        this.logClientList = new LogClientList(this);
        this.cargoList = new CargoList(this);
        this.cargoStateList = new CargoStateList(this);
    }
}

class LogisticContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.veginet.cargo');
    }

    createContext() {
        return new LogisticContext();
    }

    /**
     * CreateLogClient()    -> This function is only used internally to create LogClients but not offered in the apps
     *
     * @param {Context} ctx the transaction context
     * @param {String} logClientAppUserID
     * @param {String} logClientSurname
     * @param {String} logClientStreet
     * @param {String} logClientCity
     * @param {String} logClientZIP
     * @param {String} logClientCountry
     * */
    async CreateLogClient(ctx, logClientAppUserID, logClientSurname, logClientStreet, logClientCity, logClientZIP, logClientCountry) {
        // The idea here is that the Logistic Company also maintains a database of Logistic Clients.
        // In a real world application, the Logistic Company (Org3) would check the provided name and address
        // with the records in its database. But in this project, we eventually dropped the idea of having a database
        // and checking the provided name and address data against it as this is beyond the core idea of our project.
        // We nevertheless left the LogClient Objects intact.
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid === 'Org4MSP') {
            throw new Error('\nUser is from ' + mspid + ' and thus not allowed to create a LogClient instance as only the buyers (Org1 and Org2) can do so');
        }
        // create an instance of LogClient
        let logClient = LogClient.createLogClientInstance(logClientAppUserID, logClientSurname, logClientStreet, logClientCity,
            logClientZIP, logClientCountry);
        await ctx.logClientList.addLogClient(logClient);
        return logClient;
    }

    /**
     * RequestCargo()    -> This function is used by Org4 to create cargo instances for Org3
     *
     * @param {Context} ctx the transaction context
     * @param {String} originAppUserID
     * @param {String} originSurname
     * @param {String} originStreet
     * @param {String} originZIP
     * @param {String} originCity
     * @param {String} originCountry
     * @param {String} destinationAppUserID
     * @param {String} destinationSurname
     * @param {String} destinationStreet
     * @param {String} destinationZIP
     * @param {String} destinationCity
     * @param {String} destinationCountry
     * @param {String} tradeTicketID
     * @param {String} boxID
     * @param {String} numberOfBoxes
     * @param {String} kilosPerBox
     * */
    async RequestCargo(ctx, originAppUserID, originSurname, originStreet, originZIP, originCity, originCountry,
                       destinationAppUserID, destinationSurname, destinationStreet, destinationZIP, destinationCity,
                       destinationCountry, tradeTicketID, boxID, numberOfBoxes, kilosPerBox) {
        // Check if user is from Org4 as only the vegi seller (Org4) can request a cargo order
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid === 'Org4MSP') {
            throw new Error('\nUser is from ' + mspid + ' and thus not allowed to create a cargo instance as only the buyers (Org1 and Org2) can do so');
        }

        // Check if the cargo was already created before
        let allCargos = await this.QueryCargoByTradeTicketID(ctx, tradeTicketID);
        if (allCargos.length !== 0) {
            for (const aCargo of allCargos) {
                console.log('For testing: aCargo is: ' + aCargo);
                if (aCargo.Record.tradeTicketID === tradeTicketID) {
                    throw new Error('\nThe provided cargo entry for trade ticket ' + tradeTicketID + ' does already exist!');
                }
            }
        }
        // Check if the two LogClients (sender and receiver) were already created before
        // The idea here is that the Logistic Company also maintains a database of Logistic Clients.
        // In a real world application, the Logistic Company (Org3) would check the provided name and address
        // with the records in its database. But in this project, we eventually dropped the idea of having a database
        // and checking the provided name and address data against it as this is beyond the core idea of our project.
        // We nevertheless left the LogClient Objects intact:
        let senderLogClient;
        let allLogClientsOrigin = await this.QueryLogClient(ctx, originAppUserID);
        if (allLogClientsOrigin.length !== 0) {
            for (const aLogClientOrigin of allLogClientsOrigin) {
                if (aLogClientOrigin.Record.logClientAppUserID === originAppUserID) {
                    senderLogClient = aLogClientOrigin;
                }
            }
        } else {
            senderLogClient = await this.CreateLogClient(ctx,originAppUserID, originSurname, originStreet, originCity,
                originZIP, originCountry)
        }

        let receiverLogClient;
        let allLogClientsDestination = await this.QueryLogClient(ctx, destinationAppUserID);
        if (allLogClientsDestination.length !== 0) {
            for (const aLogClientDestination of allLogClientsDestination) {
                if (aLogClientDestination.Record.logClientAppUserID === destinationAppUserID) {
                    receiverLogClient = aLogClientDestination;
                }
            }
        } else {
            receiverLogClient = await this.CreateLogClient(ctx,destinationAppUserID, destinationSurname, destinationStreet, destinationCity,
                destinationZIP, destinationCountry)
        }

        // create an instance of Cargo
        let originData = await (senderLogClient.logClientSurname + ', ' + senderLogClient.logClientStreet + ', ' + senderLogClient.logClientZIP + ' ' +
            senderLogClient.logClientCity + ', ' + senderLogClient.logClientCountry).toString();
        let destinationData = await (receiverLogClient.logClientSurname + ', ' + receiverLogClient.logClientStreet + ', ' + receiverLogClient.logClientZIP + ' ' +
            receiverLogClient.logClientCity + ', ' + receiverLogClient.logClientCountry).toString();

        let cargoRequest = await Cargo.createCargoInstance(originAppUserID, originData, destinationAppUserID, destinationData,
            tradeTicketID, boxID, numberOfBoxes, kilosPerBox);
        await cargoRequest.setCargoState(currentStates.REQUEST_SENT);
        await ctx.cargoList.addCargo(cargoRequest);
        return cargoRequest;
    }

    /**
     * ProcessCargo()   -> Org3 user either accepts or denies cargo request
     *
     * @param {Context} ctx the transaction context
     * @param {String} tradeTicketID
     * @param {String} cargoID
     * @param {Boolean} requestWasAccepted
     * @param {String} cargoPricePerKilo
     * @param {String} promisedDeliveryTimeInDays
     * */
    async ProcessCargo(ctx, tradeTicketID, cargoID, requestWasAccepted, cargoPricePerKilo, promisedDeliveryTimeInDays) {
        // Check if user is from Org3 as only the Logistic company (Org3) can process the cargo instance
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org3MSP') {
            throw new Error('\nUser is from ' + mspid + ' and thus not allowed to process a cargo instance as only Org3 can do so');
        }
        // Check if the cargo exists
        let allCargos = await this.QueryCargoByTradeTicketID(ctx, tradeTicketID);
        if (allCargos.length === 0) {
                    throw new Error('\nThe cargo for the provided' + tradeTicketID + ' does not exist yet!');
        }

        // Get the cargo instance
        const cargoKey = await Cargo.makeKey([tradeTicketID, cargoID]);
        const cargo = await ctx.cargoList.getCargo(cargoKey);

        // Check if the current cargo-instance state is: REQUEST_SENT. Only cargo that has not yet been processed can be processed.
        let currentStateOfCargo = await cargo.getCargoState();
        if (currentStateOfCargo !== 'REQUEST_SENT'){
            throw new Error('\nThe current cargo state is ' + currentStateOfCargo + ' but NOT "REQUEST_SENT". Please check!');
        }

        // Logistic company either accepts or rejects the cargo request
        if (!requestWasAccepted){
            await cargo.setCargoState(currentStates.REQUEST_REJECTED);
            await ctx.cargoList.updateCargo(cargo);
            throw new Error('\nThe cargo request for the trade ticket ' + tradeTicketID + ' was rejected by the logistic company (Org3)!');
        }

        // Set price and promisedDeliveryTimeInDays in cargo instance
        let cargoWeight = await cargo.getCargoWeight();
        let cargoPrice = parseFloat(cargoPricePerKilo) * parseFloat(cargoWeight);
        await cargo.setCargoPrice(cargoPrice);

        // Set promisedArrivalDate
        let currentDate = new Date();
        let year = await currentDate.getFullYear();
        let month = await ("0" + (currentDate.getMonth() + 1)).slice(-2);
        let day = await ("0" + (currentDate.getDate() + parseInt(promisedDeliveryTimeInDays))).slice(-2);
        let promisedArrivalDate = await (year+month+day);
        await cargo.setPromisedArrivalDate(promisedArrivalDate);

        // create an instance of CargoState
        let cargoState = CargoState.createCargoStateInstance(cargoID);
        await ctx.cargoStateList.addCargoState(cargoState);

        await cargo.setCargoState(cargoState);
        await ctx.cargoList.updateCargo(cargo);

        return cargo;
    }

    /**
     * PickUpCargo()   -> Org3 physically picks up the cargo at the sender
     *
     * @param {Context} ctx the transaction context
     * @param {String} tradeTicketID
     * @param {String} cargoID
     * @param {String} checkInConsignerName     -> The person's name that hands over the cargo to the logistic company
     * @param {String} geoLongitude     -> The longitude at the sender's address
     * @param {String} geoLatitude      -> The latitude at the sender's address
     * */
    async PickUpCargo(ctx, tradeTicketID, cargoID, checkInConsignerName, geoLongitude, geoLatitude) {
        // Check if user is from Org3 as only the Logistic company (Org3) can process the cargo instance
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org3MSP') {
            throw new Error('\nUser is from ' + mspid + ' and thus not allowed to process a cargo instance as only Org3 can do so');
        }
        // Check if the cargo exists
        let allCargos = await this.QueryCargoByTradeTicketID(ctx, tradeTicketID);
        if (allCargos.length === 0) {
            throw new Error('\nThe cargo for the provided' + tradeTicketID + ' does not exist yet!');
        }

        // Get the cargo instance
        const cargoKey = await Cargo.makeKey([tradeTicketID, cargoID]);
        const cargo = await ctx.cargoList.getCargo(cargoKey);

        // Check if the current cargo-instance state is NOT: REQUEST_SENT. Only cargo that has been processed before can be picked up.
        let currentStateOfCargo = await cargo.getCargoState();
        if (currentStateOfCargo === 'REQUEST_SENT'){
            throw new Error('\nThe current cargo state is ' + currentStateOfCargo + '. The cargo first needs to be processed!');
        }

        // Get the cargoState instance
        const cargoStateKey = await CargoState.makeKey([cargoID]);
        const cargoState = await ctx.cargoStateList.getCargoState(cargoStateKey);

        // Check if the current cargoState-instance state is: REQUEST_ACCEPTED. Only cargo requests that previously have been accepted can be picked up.
        let currentStateOfCargoState = await cargoState.getCurrentState();
        if (currentStateOfCargoState !== 'REQUEST_ACCEPTED'){
            throw new Error('\nThe current cargo state is ' + currentStateOfCargoState + ' but NOT "REQUEST_ACCEPTED". Please check!');
        }

        // Change cargoState
        let currentStatus = currentStates.CARGO_UNDERWAY;
        let currentDate = new Date();
        let year = await currentDate.getFullYear();
        let month = await ("0" + (currentDate.getMonth() + 1)).slice(-2);
        let day = await ("0" + (currentDate.getDate())).slice(-2);
        let hour = await ("0" + (currentDate.getHours() + 1)).slice(-2);
        let minute = await ("0" + (currentDate.getMinutes())).slice(-2);
        let second = await ("0" + (currentDate.getSeconds())).slice(-2);
        let checkInDate = await (day + '.' + month  + '.' + year);
        let checkInTime = await (hour + ":" + minute + ":" + second);

        await cargoState.setCurrentState(currentStatus);
        await cargoState.setCheckInDate(checkInDate);
        await cargoState.setCheckInTime(checkInTime);
        await cargoState.setCheckInConsignerName(checkInConsignerName);
        await cargoState.setCurrentLongitude(geoLongitude);
        await cargoState.setCurrentLatitude(geoLatitude);

        // Update cargo and cargoState
        await ctx.cargoStateList.updateCargoState(cargoState);
        await cargo.setCargoState(cargoState);
        await ctx.cargoList.updateCargo(cargo);

        return cargo;
    }


    /**
     * DeliverCargo()   -> Org3 physically delivers the cargo to the receiver
     *
     * @param {Context} ctx the transaction context
     * @param {String} tradeTicketID
     * @param {String} cargoID
     * @param {String} deliveryRecipientName     -> The person's name to which the logistic company hands over the cargo
     * @param {String} geoLongitude     -> The longitude at the receivers address
     * @param {String} geoLatitude      -> The latitude at the receivers address
     * */
    async DeliverCargo(ctx, tradeTicketID, cargoID, deliveryRecipientName, geoLongitude, geoLatitude) {
        // Check if user is from Org3 as only the Logistic company (Org3) can process the cargo instance
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org3MSP') {
            throw new Error('\nUser is from ' + mspid + ' and thus not allowed to process a cargo instance as only Org3 can do so');
        }
        // Check if the cargo exists
        let allCargos = await this.QueryCargoByTradeTicketID(ctx, tradeTicketID);
        if (allCargos.length === 0) {
            throw new Error('\nThe cargo for the provided' + tradeTicketID + ' does not exist yet!');
        }

        // Get the cargo instance
        const cargoKey = await Cargo.makeKey([tradeTicketID, cargoID]);
        const cargo = await ctx.cargoList.getCargo(cargoKey);

        // Check if the current cargo-instance state is NOT: REQUEST_SENT. Only cargo that has been processed before can be picked up and delivered.
        let currentStateOfCargo = await cargo.getCargoState();
        if (currentStateOfCargo === 'REQUEST_SENT'){
            throw new Error('\nThe current cargo state is ' + currentStateOfCargo + '. The cargo first needs to be processed!');
        }

        // Get the cargoState instance
        const cargoStateKey = await CargoState.makeKey([cargoID]);
        const cargoState = await ctx.cargoStateList.getCargoState(cargoStateKey);

        // Check if the current cargoState-instance state is: CARGO_UNDERWAY. Only cargo that previously has been underway can be delivered.
        let currentStateOfCargoState = await cargoState.getCurrentState();
        if (currentStateOfCargoState !== 'CARGO_UNDERWAY'){
            throw new Error('\nThe current cargo state is ' + currentStateOfCargoState + ' but NOT "CARGO_UNDERWAY". Please check!');
        }

        // Change cargoState
        let currentStatus = currentStates.CARGO_DELIVERED;
        let currentDate = new Date();
        let year = await currentDate.getFullYear();
        let month = await ("0" + (currentDate.getMonth() + 1)).slice(-2);
        let day = await ("0" + (currentDate.getDate())).slice(-2);
        let hour = await ("0" + (currentDate.getHours() + 1)).slice(-2);
        let minute = await ("0" + (currentDate.getMinutes())).slice(-2);
        let second = await ("0" + (currentDate.getSeconds())).slice(-2);
        let deliveryDate = await (day + '.' + month + '.' + year);
        let deliveryTime = await (hour + ":" + minute + ":" + second);

        // Check if delivery was too late
        let realArrivalDate = await (year+month+day);
        let promisedArrivalDate = await cargo.getPromisedArrivalDate();

        if (parseInt(realArrivalDate) > parseInt(promisedArrivalDate)){
            await cargoState.setDeliveryTooLate(true);
        }

        await cargoState.setCurrentState(currentStatus);
        await cargoState.setDeliveryDate(deliveryDate);
        await cargoState.setDeliveryTime(deliveryTime);
        await cargoState.setDeliveryRecipientName(deliveryRecipientName);
        await cargoState.setCurrentLongitude(geoLongitude);
        await cargoState.setCurrentLatitude(geoLatitude);

        // Update cargo and cargoState
        await ctx.cargoStateList.updateCargoState(cargoState);
        await cargo.setCargoState(cargoState);
        await ctx.cargoList.updateCargo(cargo);

        return cargo;
    }

    /**
     * ChangeCurrentLocation()   -> The cargo (or the delivery truck attached to it) sends GPS signals that contain
     * longitude and latitude of the current position of the cargo. This function stores the geo data in the blockchain.
     *
     * @param {Context} ctx the transaction context
     * @param {String} tradeTicketID
     * @param {String} cargoID
     * @param {String} geoLongitude     -> The longitude at the sender's address
     * @param {String} geoLatitude      -> The latitude at the sender's address
     * */
    async ChangeCurrentLocation(ctx, tradeTicketID, cargoID, geoLongitude, geoLatitude) {
        // Check if user is from Org3 as only the Logistic company (Org3) can process the cargo instance
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid !== 'Org3MSP') {
            throw new Error('\nUser is from ' + mspid + ' and thus not allowed to process a cargo instance as only Org3 can do so');
        }
        // Check if the cargo exists
        let allCargos = await this.QueryCargoByTradeTicketID(ctx, tradeTicketID);
        if (allCargos.length === 0) {
            throw new Error('\nThe cargo for the provided' + tradeTicketID + ' does not exist yet!');
        }

        // Get the cargo instance
        const cargoKey = await Cargo.makeKey([tradeTicketID, cargoID]);
        const cargo = await ctx.cargoList.getCargo(cargoKey);

        // Check if the current cargo-instance state is NOT: REQUEST_SENT. Only cargo that has been processed and picked up before can change its location.
        let currentStateOfCargo = await cargo.getCargoState();
        if (currentStateOfCargo === 'REQUEST_SENT'){
            throw new Error('\nThe current cargo state is ' + currentStateOfCargo + '. The cargo first needs to be processed!');
        }

        // Get the cargoState instance
        const cargoStateKey = await CargoState.makeKey([cargoID]);
        const cargoState = await ctx.cargoStateList.getCargoState(cargoStateKey);

        // Check if the current cargoState-instance state is: CARGO_UNDERWAY -> Only the location of cargo that is underway can be changed
        let currentStateOfCargoState = await cargoState.getCurrentState();
        if (currentStateOfCargoState !== 'CARGO_UNDERWAY'){
            throw new Error('\nThe current cargo state is ' + currentStateOfCargoState + '. The location can only be changed for cargo that is underway!');
        }

        // Change location
        await cargoState.setCurrentLongitude(geoLongitude);
        await cargoState.setCurrentLatitude(geoLatitude);

        // Update cargo and cargoState
        await ctx.cargoStateList.updateCargoState(cargoState);
        await cargo.setCargoState(cargoState);
        await ctx.cargoList.updateCargo(cargo);

        return cargo;
    }

    /**
     * GetCurrentLocation()   -> Retrieve the current geo position (longitude, latitude) of the cargo.
     *
     * @param {Context} ctx the transaction context
     * @param {String} cargoID
     * */
    async GetCurrentLocation(ctx, cargoID) {
        // No Check for MSPs as every member of the channel can check the current location of the cargo

        // Check if the cargo exists
        let allCargos = await this.QueryCargo(ctx, cargoID);
        if (allCargos.length === 0) {
            throw new Error('\nThe cargo for the provided cargoID' + cargoID + ' does not exist yet!');
        }
        else {
            for (const aCargo of allCargos){
                if (aCargo.Record.cargoState === currentStates.REQUEST_SENT){
                    throw new Error('\nA cargo request was sent but the Logistic Company (Org3) has not yet processed the cargo request. ' +
                        ' The current location thus cannot be retrieved!');
                }
                else{
                    let allCargoStates = await this.QueryCargoState(ctx, cargoID);
                    for (const aCargoState of allCargoStates) {
                        if (aCargoState.Record.currentState === currentStates.REQUEST_ACCEPTED) {
                            throw new Error('\nThe cargo request was processed but the Logistic Company (Org3) has not yet picked up the cargo. ' +
                                ' The current location thus cannot be retrieved!');
                        }
                    }
                }
            }
        }

        try{
            // Get the cargoState instance
            const cargoStateKey = await CargoState.makeKey([cargoID]);
            const cargoState = await ctx.cargoStateList.getCargoState(cargoStateKey);

            // Get location data
            const longitude =  await cargoState.getCurrentLongitude();
            const latitude =  await cargoState.getCurrentLatitude();

            return JSON.stringify({longitude, latitude});
        }
        catch(e){
            console.error(`The current location can not be found!: ${e}`);
        }
    }

    /**
   Queries
   */

    async QueryCargoStateHistory(ctx, cargoID) {
        // Get a key to be used for History query
        let query = new LogQuery(ctx, 'org.veginet.cargostate');
        return await query.getCargoStateHistory(cargoID);
    }

    async QueryCargoHistory(ctx, tradeTicketID, cargoID) {
        // Get a key to be used for History query
        let query = new LogQuery(ctx, 'org.veginet.cargo');
        return await query.getCargoHistory(tradeTicketID, cargoID);
    }

    async QueryLogClient(ctx, logClientAppUserID) {
        let query = new LogQuery(ctx, 'org.veginet.logclient');
        return await query.queryByAttribute('logClientAppUserID', logClientAppUserID);
    }

    async QueryCargoState(ctx, cargoID) {
        let query = new LogQuery(ctx, 'org.veginet.cargostate');
        return await query.queryByAttribute('cargoID', cargoID);
    }

    async QueryCargo(ctx, cargoID) {
        let query = new LogQuery(ctx, 'org.veginet.cargo');
        return await query.queryByAttribute('cargoID', cargoID);
    }

    async QueryCargoByTradeTicketID(ctx, tradeTicketID) {
        let query = new LogQuery(ctx, 'org.veginet.cargo');
        return await query.queryKeyByFirstPartOfKey(tradeTicketID);
    }
}

module.exports = LogisticContract;
