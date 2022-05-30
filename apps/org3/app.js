'use strict';

const path = require('path');
const LogisticFunction = require('../logisticfuncs.js');
const GetAuthAndContract = require('../getauthandcontract.js');

const firstChannelName = 'logisticchannel1';
const firstChaincodeName = 'logisticCC1';
const secondChannelName = 'logisticchannel2';
const secondChaincodeName = 'logisticCC2';

const caHostName = 'ca.org3.vegi.com';
const walletPath = path.join(__dirname, 'wallet');
const mspOrg = 'Org3MSP';
const affiliation = 'org3.department1';
const orgUserId = 'appUserOrg3';				// in some functions this is referenced as "appUserID" not "orgUserId"
const peerOrganization = 'org3.vegi.com';
const connectionJSON = 'connection-org3.json';


// Data for functions:
const tradeTicketID = 'TradeTicket1';
const cargoID = 'Cargo1';
const checkInConsignerName = 'MisterABC who sent the cargo';
const geoLongitude1 = '8.67638';
const geoLatitude1 = '50.11403';
const geoLongitude2 = '8.63826';
const geoLatitude2 = '49.86733';
const geoLongitude3 = '8.39151';
const geoLatitude3 = '49.01570';
const geoLongitude4 = '9.18474';
const geoLatitude4 = '48.78215';
const deliveryRecipientName = 'MissesXYZ who received the cargo';
const cargoPricePerKilo = '2.50';
const promisedDeliveryTimeInDays = '3';
const requestWasAccepted = true;



async function main() {
	const args = process.argv;
	console.log(args);

	const getAuthAndContract = new GetAuthAndContract();

	try {
		await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
		const logisticContract1 = await getAuthAndContract.getContract(orgUserId, firstChannelName, firstChaincodeName);
		const logisticFunc1 = new LogisticFunction(logisticContract1);

		// ////// These are the functions to call:
		// 1. The Logistic company (Org3) checks whether there are any cargo requests. This could be done with a listener.
		// It could be called by entering a tradeTicketID here ... .
		// await logisticFunc1.queryCargoByTradeTicketID(tradeTicketID);		// 1.

		// 2. The Logistic company (Org3) processes cargo requests, either accepts or denies it
		// await logisticFunc1.processCargo(tradeTicketID, cargoID, requestWasAccepted, cargoPricePerKilo, promisedDeliveryTimeInDays);		// 2.

		// 3. The Logistic company (Org3) picks up the cargo at the sender place if it has accepted the request before
		// await logisticFunc1.pickUpCargo(tradeTicketID, cargoID, checkInConsignerName, geoLongitude1, geoLatitude1);		// 3.
		// 3.A. One could check the address that corresponds with the provided geoLongitude and geoLatitude at pickUp:
		// await logisticFunc1.getCurrentLocation(cargoID);

		// 4. Now the cargo is underway and sends GPS-data that is processed by the changeCurrentLocation()-Function
		// await logisticFunc1.changeCurrentLocation(tradeTicketID, cargoID, geoLongitude2, geoLatitude2);
		// 4.A. One could check the address that corresponds with the current location of the cargo:
		// await logisticFunc1.getCurrentLocation(cargoID);

		// 5. Now the cargo again sends GPS-data that is processed by the changeCurrentLocation()-Function
		// await logisticFunc1.changeCurrentLocation(tradeTicketID, cargoID, geoLongitude3, geoLatitude3);
		// 5.A. One again could check the address that corresponds with the current location of the cargo:
		// await logisticFunc1.getCurrentLocation(cargoID);

		// 6. Eventually the cargo is delivered
		// await logisticFunc1.deliverCargo(tradeTicketID, cargoID, deliveryRecipientName, geoLongitude4, geoLatitude4);
		// 6.A. One could check the address that corresponds with the provided geoLongitude and geoLatitude at delivery
		// await logisticFunc1.getCurrentLocation(cargoID);
		// 6.B. One could also check the address of an earlier location by providing geoLongitude and geoLatitude:
		// await logisticFunc1.getLocationFromLongLat(geoLongitude2, geoLatitude2);

		// 7. To view the entire history of the cargo, call queryCargoHistory()-Function
		// await logisticFunc1.queryCargoHistory(tradeTicketID, cargoID);

		// 8. To only view the history of the cargo states, call queryCargoStateHistory()-Function
		// await logisticFunc1.queryCargoStateHistory(cargoID);
	}
	catch (e){
		console.error(`******** FAILED to run main()-Function of app: ${e}`);
	}
	finally {
		await getAuthAndContract.disconnectGateway();
	}

}

main();
