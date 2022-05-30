'use strict';

const { prettyJSONString } = require('../utils/AppUtil.js');
const NodeGeocoder = require('node-geocoder');

class LogisticFunction {

    constructor(contract) {
        this.contract = contract;
    }

    async requestCargo(originAppUserID, originSurname, originStreet, originZIP, originCity, originCountry,
                       destinationAppUserID, destinationSurname, destinationStreet, destinationZIP, destinationCity,
                       destinationCountry, tradeTicketID, boxID, numberOfBoxes, kilosPerBox) {
        try {
            console.log('\n--> Submit Transaction: RequestCargo, creates new cargo request with originAppUserID, originSurname, originStreet, originZIP, originCity, originCountry,\n' +
                '                       destinationAppUserID, destinationSurname, destinationStreet, destinationZIP, destinationCity,\n' +
                '                       destinationCountry, tradeTicketID, boxID, numberOfBoxes, kilosPerBox');
            let result = await this.contract.submitTransaction('RequestCargo', originAppUserID, originSurname, originStreet, originZIP, originCity, originCountry,
                destinationAppUserID, destinationSurname, destinationStreet, destinationZIP, destinationCity,
                destinationCountry, tradeTicketID, boxID, numberOfBoxes, kilosPerBox);
            console.log(`*** Result committed: The following cargo request was created: ${prettyJSONString(result.toString())}`);
        }
        catch (e) {
            console.error(`******** FAILED to run RequestCargo()-Function: ${e}`);
        }
    }

    async processCargo(tradeTicketID, cargoID, requestWasAccepted, cargoPricePerKilo, promisedDeliveryTimeInDays) {
        try {
            console.log('\n--> Submit Transaction: ProcessCargo, processes the cargo request with tradeTicketID, cargoID, requestWasAccepted, cargoPricePerKilo, promisedArrivalDate');
            let result = await this.contract.submitTransaction('ProcessCargo', tradeTicketID, cargoID, requestWasAccepted, cargoPricePerKilo, promisedDeliveryTimeInDays);
            console.log(`*** Result committed: The following cargo request was processed by the logistic company (Org3): ${prettyJSONString(result.toString())}`);
        }
        catch (e) {
            console.error(`******** FAILED to run ProcessCargo()-Function: ${e}`);
        }
    }

    async pickUpCargo(tradeTicketID, cargoID, checkInConsignerName, geoLongitude, geoLatitude) {
        try {
            console.log('\n--> Submit Transaction: PickUpCargo, Org3 physically picks up the cargo, parameters are tradeTicketID, cargoID, checkInConsignerName, geoLongitude, geoLatitude');
            let result = await this.contract.submitTransaction('PickUpCargo', tradeTicketID, cargoID, checkInConsignerName, geoLongitude, geoLatitude);
            console.log(`*** Result committed: The following cargo was picked up by the logistic company (Org3): ${prettyJSONString(result.toString())}`);
        }
        catch (e) {
            console.error(`******** FAILED to run PickUpCargo()-Function: ${e}`);
        }
    }

    async changeCurrentLocation(tradeTicketID, cargoID, geoLongitude, geoLatitude) {
        try {
            console.log('\n--> Submit Transaction: ChangeCurrentLocation, Org3 changes the current location of the cargo, parameters are tradeTicketID, cargoID, geoLongitude, geoLatitude');
            let result = await this.contract.submitTransaction('ChangeCurrentLocation', tradeTicketID, cargoID, geoLongitude, geoLatitude);
            console.log(`*** Result committed: The current cargo address was changed by the logistic company (Org3): ${prettyJSONString(result.toString())}`);
        }
        catch (e) {
            console.error(`******** FAILED to run ChangeCurrentLocation()-Function: ${e}`);
        }
    }

    async deliverCargo(tradeTicketID, cargoID, deliveryRecipientName, geoLongitude, geoLatitude) {
        try {
            console.log('\n--> Submit Transaction: DeliverCargo, Org3 physically delivers the cargo, parameters are tradeTicketID, cargoID, deliveryRecipientName, geoLongitude, geoLatitude');
            let result = await this.contract.submitTransaction('DeliverCargo', tradeTicketID, cargoID, deliveryRecipientName, geoLongitude, geoLatitude);
            console.log(`*** Result committed: The following cargo was delivered by the logistic company (Org3): ${prettyJSONString(result.toString())}`);
        }
        catch (e) {
            console.error(`******** FAILED to run DeliverCargo()-Function: ${e}`);
        }
    }

    async getCurrentLocation(cargoID) {
        try {
            console.log('\n--> Submit Transaction: GetCurrentLocation, shows the current location address of the cargo, parameter is cargoID');
            let geoData = JSON.parse(await this.contract.submitTransaction('GetCurrentLocation', cargoID));
            let geoLocation = await this.getGeoData(geoData.longitude, geoData.latitude);
            console.log('This is the entire geoLocation:\n', geoLocation[0]);
            console.log('This is the Street:', geoLocation[0].streetName);
            console.log('This is the Street Number:', geoLocation[0].streetNumber);
            console.log('This is the ZIPcode:', geoLocation[0].zipcode);
            console.log('This is the City:', geoLocation[0].city);
            console.log('This is the CountryState:', geoLocation[0].state);
            console.log('This is the Country:', geoLocation[0].country);
            return geoLocation[0];
        }
        catch (e) {
            console.error(`******** FAILED to run GetCurrentLocation()-Function: ${e}`);
        }
    }

    async getLocationFromLongLat(geoLongitude, geoLatitude) {
        try {
            console.log('\n--> Submit Transaction: getLocationFromLongLat, shows the address for the provided longitude and latitude, parameters are geoLongitude, geoLatitude');
            let geoLocation = await this.getGeoData(geoLongitude, geoLatitude);
            console.log('This is the entire geoLocation:\n', geoLocation[0]);
            console.log('This is the Street:', geoLocation[0].streetName);
            console.log('This is the Street Number:', geoLocation[0].streetNumber);
            console.log('This is the ZIPcode:', geoLocation[0].zipcode);
            console.log('This is the City:', geoLocation[0].city);
            console.log('This is the CountryState:', geoLocation[0].state);
            console.log('This is the Country:', geoLocation[0].country);
        }
        catch (e) {
            console.error(`******** FAILED to run getLocationFromLongLat()-Function: ${e}`);
        }
    }

    async queryCargo(cargoID) {
        try {
            console.log('\n--> Submit Transaction: QueryCargo, queries cargo by cargoID');
            let result = await this.contract.evaluateTransaction('QueryCargo', cargoID);
            console.log(`*** Result committed: The following is the cargo for the provided cargoID: ${prettyJSONString(result.toString())}`);
        }
        catch (e) {
            console.error(`******** FAILED to run createCargo()-Function: ${e}`);
        }
    }

    async queryCargoHistory(tradeTicketID, cargoID) {
        try {
            console.log('\n--> Submit Transaction: QueryCargoHistory, queries history of cargo by tradeTicketID and cargoID');
            let result = await this.contract.evaluateTransaction('QueryCargoHistory', tradeTicketID, cargoID);
            console.log(`*** Result committed: The following is the cargo history for the provided tradeTicketID and cargoID: ${prettyJSONString(result.toString())}`);
            return result;
        }
        catch (e) {
            console.error(`******** FAILED to run createCargo()-Function: ${e}`);
        }
    }

    async queryCargoState(cargoID) {
        try {
            console.log('\n--> Submit Transaction: QueryCargoState, queries cargo state by cargoID');
            let result = await this.contract.submitTransaction('QueryCargoState', cargoID);
            console.log(`*** Result committed: The following is the cargo state for the provided cargoID: ${prettyJSONString(result.toString())}`);
        }
        catch (e) {
            console.error(`******** FAILED to run createCargo()-Function: ${e}`);
        }
    }

    async queryCargoStateHistory(cargoID) {
        try {
            console.log('\n--> Submit Transaction: QueryCargoStateHistory, queries history of cargo states by cargoID');
            let result = await this.contract.submitTransaction('QueryCargoStateHistory', cargoID);
            console.log(`*** Result committed: The following is the cargo state history for the provided cargoID: ${prettyJSONString(result.toString())}`);
        }
        catch (e) {
            console.error(`******** FAILED to run createCargo()-Function: ${e}`);
        }
    }

    async queryCargoByTradeTicketID(tradeTicketID) {
        try {
            console.log('\n--> Submit Transaction: QueryCargoByTradeTicketID, queries cargo by tradeTicketID');
            let result = await this.contract.submitTransaction('QueryCargoByTradeTicketID', tradeTicketID);
            console.log(`*** Result committed: The following cargo instance was created: ${prettyJSONString(result.toString())}`);
            var firstElement = eval(result.toString())[0];
            return firstElement;
        }
        catch (e) {
            console.error(`******** FAILED to run createCargo()-Function: ${e}`);
        }
    }

    async getGeoData(geoLongitude, geoLatitude){

        const options = {
            provider: 'openstreetmap',     // 'openstreetmap'
            // httpAdapter: 'https', // Default
            // apiKey: ' ', // for Mapquest, OpenCage, Google Premier
            // formatter: 'json' // 'gpx', 'string', ...
        };

        const geoCoder = NodeGeocoder(options);
        const longitude = await parseFloat(geoLongitude);
        const latitude = await parseFloat(geoLatitude);

        return geoCoder.reverse({lat: latitude, lon: longitude}, function(err, res) {
            return res;
        });
    }

}

module.exports = LogisticFunction;
