#!/bin/bash

source scriptUtils.sh

CHANNEL_NAME="$1"
CHANNEL_PROFILE_NAME="$2"
DELAY="$3"
MAX_RETRY="$4"
VERBOSE="$5"

# import utils
. scripts/envVar.sh


createChannelTx() {

	set -x
	configtxgen -profile $CHANNEL_PROFILE_NAME -outputCreateChannelTx ./channel-artifacts/${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME
	res=$?
	{ set +x; } 2>/dev/null
	if [ $res -ne 0 ]; then
		fatalln "Failed to generate channel configuration transaction..."
	fi

}

createAncorPeerTx() {

	for orgmsp in Org1MSP Org2MSP Org4MSP; do

	infoln "Generating anchor peer update transaction for ${orgmsp}"
	set -x
	configtxgen -profile $CHANNEL_PROFILE_NAME -outputAnchorPeersUpdate ./channel-artifacts/${orgmsp}anchors.tx -channelID $CHANNEL_NAME -asOrg ${orgmsp}
	res=$?
	{ set +x; } 2>/dev/null
	if [ $res -ne 0 ]; then
		fatalln "Failed to generate anchor peer update transaction for ${orgmsp}..."
	fi
	done
}

createChannel() {
	setGlobals 1
	# Poll in case the raft leader is not set yet
	local rc=1
	local COUNTER=1
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
		sleep $DELAY
		set -x
		peer channel create -o localhost:7050 -c $CHANNEL_NAME --ordererTLSHostnameOverride orderer.vegi.com -f ./channel-artifacts/${CHANNEL_NAME}.tx --outputBlock ./channel-artifacts/${CHANNEL_NAME}.block --tls --cafile $ORDERER_CA >&log.txt
		res=$?
		{ set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "Channel creation failed"
	successln "Channel '$CHANNEL_NAME' created"
}

# queryCommitted ORG
joinChannel() {
  ORG=$1
  setGlobals $ORG
	local rc=1
	local COUNTER=1
	## Sometimes Join takes time, hence retry
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    set -x
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block >&log.txt
    res=$?
    { set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "After $MAX_RETRY attempts, peer0.org${ORG} has failed to join channel '$CHANNEL_NAME' "
}

updateAnchorPeers() {
  ORG=$1
  setGlobals $ORG
	local rc=1
	local COUNTER=1
	## Sometimes Join takes time, hence retry
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    set -x
		peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.vegi.com -c $CHANNEL_NAME -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls --cafile $ORDERER_CA >&log.txt
    res=$?
    { set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
  verifyResult $res "Anchor peer update failed"
  successln "Anchor peers updated for org '$CORE_PEER_LOCALMSPID' on channel '$CHANNEL_NAME'"
  sleep $DELAY
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    fatalln "$2"
  fi
}

# FABRIC_CFG_PATH=${PWD}/config

## Create channeltx
infoln "Generating channel create transaction '${CHANNEL_NAME}.tx'"
createChannelTx

## Create anchorpeertx
infoln "Generating anchor peer update transactions"
createAncorPeerTx

# FABRIC_CFG_PATH=$PWD/../config/


## Create channel
infoln "Creating channel ${CHANNEL_NAME}"
createChannel


## Join all the peers to the channel
if [[ $CHANNEL_NAME == "tradechannel1" ]]; then
  infoln "Join Org1 peers to the channel..."
  joinChannel 1
  infoln "Join Org4 peers to the channel..."
  joinChannel 4
elif [[ $CHANNEL_NAME == "tradechannel2" ]]; then
  infoln "Join Org2 peers to the channel..."
  joinChannel 2
  infoln "Join Org4 peers to the channel..."
  joinChannel 4
elif [[ $CHANNEL_NAME == "logisticchannel1" ]]; then
  infoln "Join Org1 peers to the channel..."
  joinChannel 1
  infoln "Join Org1 peers to the channel..."
  joinChannel 3
  infoln "Join Org4 peers to the channel..."
  joinChannel 4
elif [[ $CHANNEL_NAME == "logisticchannel2" ]]; then
  infoln "Join Org2 peers to the channel..."
  joinChannel 2
  infoln "Join Org3 peers to the channel..."
  joinChannel 3
  infoln "Join Org4 peers to the channel..."
  joinChannel 4
else fatalln "Channels could not be joined"
fi



## Set the anchor peers for each org in the channel
## Nur ein Anchor Peer notwendig, zudem kann Org3 keinen Anchor Peer stellen
# siehe dazu: https://hyperledger-fabric.readthedocs.io/en/release-1.1/glossary.html#anchor-peer
# Ich habe hier nur die network system peers genommen
infoln "Updating anchor peers for org1..."
updateAnchorPeers 1
infoln "Updating anchor peers for org2..."
updateAnchorPeers 2
infoln "Updating anchor peers for org4..."
updateAnchorPeers 4


successln "${CHANNEL_NAME}-channel successfully joined"

exit 0
