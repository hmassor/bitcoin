#!/bin/bash
##################################################################################################################
# This script sets the environment variables and puts the user in the role of peer0.org2.vegi.com
# Important: This script must be run as: . ./setUserOrg2.sh
# Otherwise the environment variables are not valid for the current bash but
# only valid for the child processes of the bash it is run in
# If you want to add these permanently, you must include it in: /home/.profile
##################################################################################################################
# Adds Hyperledger Fabric executables to PATH
export PATH=${PWD}/../bin:$PATH
# Access to config files:
export FABRIC_CFG_PATH=${PWD}/config
# Hiermit haben wir Zugriff auf den Node Peer0 auf Org2:
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.vegi.com/peers/peer0.org2.vegi.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.vegi.com/users/Admin@org2.vegi.com/msp
export CORE_PEER_ADDRESS=localhost:7151