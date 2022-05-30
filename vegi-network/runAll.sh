#!/bin/bash

source scriptUtils.sh

# Set environment variables and definitions. VERY IMPORTANT: There must be a dot (".") before the script command
# to ensure that not only child processes inherit the environment variables but also the parent/current process
. ./setEnv.sh

#run 'npm install'
./runNPM.sh

# build and start network
./network.sh up

# build channels
./network.sh createChannel

# deploy chaincode on channels
./scripts/deployCC.sh tradechannel1 tradeCC1
./scripts/deployCC.sh logisticchannel1 logisticCC1
./scripts/deployCC.sh tradechannel2 tradeCC2
./scripts/deployCC.sh logisticchannel2 logisticCC2

