'use strict';

const path = require('path');
const TradeFunction = require('../tradefuncs.js');
const LogisticFunction = require('../logisticfuncs.js');
const GetAuthAndContract = require('../getauthandcontract.js');

const tradeChannelName = 'tradechannel2';
const tradeChaincodeName = 'tradeCC2';
const logisticChannelName = 'logisticchannel2';
const logisticChaincodeName = 'logisticCC2';


const caHostName = 'ca.org2.vegi.com'
const walletPath = path.join(__dirname, 'wallet');
const mspOrg = 'Org2MSP';
const affiliation = 'org2.department1';
const orgUserId = 'appUserOrg2';				// in some functions this is referenced as "appUserID" not "orgUserId"
const peerOrganization = 'org2.vegi.com';
const connectionJSON = 'connection-org2.json'

// Data for functions:
// CreateOwner:
const ownerSurname = 'Mueller';
const ownerStreet = 'Schillerstr. 777';
const ownerZIP = '70389';
const ownerCity = 'Stuttgart am Neckar';
const ownerCountry = 'Deutschland';

// WhatIsOnStock:
const vegiID = 'VegiID1';

// BuyStock:
const boxID = 'Box1';
const currentOwnerID = 'appUserOrg4';
const newOwnerID = orgUserId;
const numberOfBoxesTraded = '2';
const sellerAppUserID = currentOwnerID;

// GetCurrentLocation:
const cargoID = 'Cargo1';

// Change owner address
const newOwnerStreet = 'Schillerstr. 7';
const newOwnerCity = 'Stuttgart';
const newOwnerZIP = '70389';
const newOwnerCountry = 'Deutschland';


async function my_main() {
	const args = process.argv;
	console.log(args);

	const getAuthAndContract = new GetAuthAndContract();

	try {
		await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)

		const tradeContract = await getAuthAndContract.getContract(orgUserId, tradeChannelName, tradeChaincodeName);
		const tradeFunc = new TradeFunction(tradeContract);

		const logisticContract = await getAuthAndContract.getContract(orgUserId, logisticChannelName, logisticChaincodeName);
		const logisticFunc = new LogisticFunction(logisticContract);

		// 1. Create instances of owner
		// await tradeFunc.createOwner(mspOrg, orgUserId, ownerSurname, ownerStreet, ownerCity, ownerZIP, ownerCountry);

		// 2. Optionally, Org4, Org1, Org2 can change the address of an owner/appUser
		// await tradeFunc.changeOwnerAddress(mspOrg, orgUserId, newOwnerStreet, newOwnerCity, newOwnerZIP, newOwnerCountry);

		// 3. Check what is on stock at Org4 (Vegi-Seller)
		// await tradeFunc.whatIsOnStock(sellerAppUserID);

		// 4. User buys stock from user of Org4
		// await tradeFunc.buyStock(boxID, currentOwnerID, newOwnerID, numberOfBoxesTraded);

		// 5. After the cargo was processed by the Logistic Company, the user can check: Where is my vegi cargo?
		// await logisticFunc.getCurrentLocation(cargoID);

		// 6. Show stock history
		// await tradeFunc.showStockHistory(boxID, orgUserId);


	}
	catch (e){
		console.error(`******** FAILED to run main()-Function of app: ${e}`);
	}

	finally {
		await getAuthAndContract.disconnectGateway();
	}
}

my_main();
