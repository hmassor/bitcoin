'use strict';

const path = require('path');
const TradeFunction = require('../tradefuncs.js');
const LogisticFunction = require('../logisticfuncs.js');
const GetAuthAndContract = require('../getauthandcontract.js');

const firstChannelName = 'tradechannel1';
const firstChaincodeName = 'tradeCC1';
const secondChannelName = 'tradechannel2';
const secondChaincodeName = 'tradeCC2';

const caHostName = 'ca.org4.vegi.com';
const walletPath = path.join(__dirname, 'wallet');
const mspOrg = 'Org4MSP';
const affiliation = 'org4.department1';
const orgUserId = 'appUserOrg4';				// in some functions this is referenced as "appUserID" not "orgUserId"
const peerOrganization = 'org4.vegi.com';
const connectionJSON = 'connection-org4.json';

const vegiTypes = {
	TOMATO: 'Tomato',
	POTATO: 'Potato',
	CUCUMBER: 'Cucumber',
	PEPPER: 'Pepper'
}


// Data for functions:

// CreateVegi
const vegiID = 'VegiID1';
const vegiType = vegiTypes.TOMATO;
const kilosPerBox = '20';

// CreateGrower
const growerID = 'Grower1';
const growerSurname = 'Bauer';
const growerStreet = 'Gurkenstr. 5';
const growerCity = 'Bad Homburg';
const growerZIP = '61348';
const growerCountry = 'Deutschland';

// CreateOwner
const ownerSurname = 'Maier';
const ownerStreet = 'Goethestr. 888';
const ownerZIP = '60313';
const ownerCity = 'Frankfurt am Main';
const ownerCountry = 'Deutschland';

// CreateStock
const boxID = 'Box1';
const stockPricePerKilo = '3.00';
const harvestDate = '20210223';
const numberOfBoxes = '100';
const newOwnerAppUserID = orgUserId;
const stockExistsFlag = 'true';
const previousOwnerAppUserID = growerID;

// SellStock
const currentOwnerID = orgUserId;
const newOwnerID = 'appUserOrg1';
const numberOfBoxesTraded = '2';

// Change stock quantity or stock price
const newNumberOfBoxes = '90';
const newStockPricePerKilo = '2.90';

// Change owner address
const newOwnerStreet = 'Goethestr. 8';
const newOwnerCity = 'Frankfurt';
const newOwnerZIP = '60313';
const newOwnerCountry = 'Deutschland';


async function main() {
	const args = process.argv;
	console.log(args);

	const getAuthAndContract = new GetAuthAndContract();

	try {
		await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
		const tradeContract1 = await getAuthAndContract.getContract(orgUserId, firstChannelName, firstChaincodeName);

		// Here go the app-functions from tradefuncs
		const tradeFunc1 = new TradeFunction(tradeContract1);

		// 1. Create instances of vegi, grower, owner and stock
		// await tradeFunc1.createVegi(vegiID, vegiType, kilosPerBox);
		// await tradeFunc1.createGrower(growerID, growerSurname, growerStreet, growerCity, growerZIP, growerCountry);
		// await tradeFunc1.createOwner(mspOrg, orgUserId, ownerSurname, ownerStreet, ownerCity, ownerZIP, ownerCountry);
		// await tradeFunc1.createStock(growerID, boxID, vegiID, stockPricePerKilo, harvestDate, numberOfBoxes,  previousOwnerAppUserID, newOwnerAppUserID, stockExistsFlag);

		// 2. Optionally, Org4, Org1, Org2 can change the address of an owner/appUser
		// await tradeFunc1.changeOwnerAddress(mspOrg, orgUserId, newOwnerStreet, newOwnerCity, newOwnerZIP, newOwnerCountry);

		// 3. Optionally, Org4 can change its offered stock price and quantity
		// await tradeFunc1.changeStockQuantity(boxID, orgUserId, newNumberOfBoxes);
		// await tradeFunc1.changeStockPrice(boxID, orgUserId, newStockPricePerKilo);

		// 4. Show stock history
		// await tradeFunc1.showStockHistory(boxID, orgUserId);

	}
	catch (e){
		console.error(`******** FAILED to run main()-Function of app: ${e}`);
	}
	finally {
		await getAuthAndContract.disconnectGateway();
	}

}

main();
