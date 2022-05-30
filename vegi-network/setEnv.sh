#!/bin/bash

source scriptUtils.sh

setEnvironmentVars() {
  # Definitions
  # native binaries for your platform, e.g., darwin-amd64 or linux-amd64
  export OS_ARCH=$(echo "$(uname -s | tr '[:upper:]' '[:lower:]' | sed 's/mingw64_nt.*/windows/')-$(uname -m | sed 's/x86_64/amd64/g')" | awk '{print tolower($0)}')
  # Logging
  export HFC_LOGGING='{"debug":"console"}'
  # Using "Certificate Authorities". default is cryptogen
  export CRYPTO="Certificate Authorities"
  # timeout duration - the duration the CLI should wait for a response from # another container before giving up
  export MAX_RETRY=5
  # Delay for some functions
  export DELAY=3
  # default for delay between commands
  export CLI_DELAY=3
  # endorsement policy defaults to "NA". This would allow chaincodes to use the majority default policy. Change settings in
  export CC_END_POLICY="NA"
  # collection configuration defaults to "NA"
  export CC_COLL_CONFIG="NA"
  # chaincode init function defaults to "NA". Must be a function (name) that does exist in the chaincode, i.e. "InitLedger"
  export CC_INIT_FCN="NA"
  # use this as the default docker-compose yaml definition
  export COMPOSE_FILE_BASE=docker/docker-compose-vegi-net.yaml
  # docker-compose.yaml file if you are using couchdb
  export COMPOSE_FILE_COUCH=docker/docker-compose-couch.yaml
  # certificate authorities compose file
  export COMPOSE_FILE_CA=docker/docker-compose-ca.yaml
  # Prefix for the network name (net). If not set, it defaults to 'docker_'
  export COMPOSE_PROJECT_NAME="net"
  # use javascript as the default language for chaincode
  export CC_SRC_LANGUAGE="javascript"
  # Chaincode version
  export CC_VERSION="1.0"
  # Chaincode definition sequence
  export CC_SEQUENCE=1
  # default image tag
  export IMAGETAG="latest"
  # default ca image tag
  export CA_IMAGETAG="latest"
  # default databasecd
  export DATABASE="couchdb"
  # Access to config files:
  export FABRIC_CFG_PATH=${PWD}/config
  export VERBOSE=false
  # Taken from deployCC.sh script
  export CC_RUNTIME_LANGUAGE=node
  # Set PATH to bin
  export PATH=${PWD}/../bin:$PATH
}

setEnvironmentVars
res=$?

if [ $res -ne 0 ]; then
  fatalln "Failed to set global environment variables"
else
  infoln "The following environment variables and definitions were set globally: "
  println "- OS_ARCH: ${C_GREEN}${OS_ARCH}${C_RESET}"
  println "- HFC_LOGGING: ${C_GREEN}${HFC_LOGGING}${C_RESET}"
  println "- CRYPTO: ${C_GREEN}${CRYPTO}${C_RESET}"
  println "- MAX_RETRY: ${C_GREEN}${MAX_RETRY}${C_RESET}"
  println "- DELAY: ${C_GREEN}${DELAY}${C_RESET}"
  println "- CLI_DELAY: ${C_GREEN}${CLI_DELAY}${C_RESET}"
  println "- CC_END_POLICY: ${C_GREEN}${CC_END_POLICY}${C_RESET}"
  println "- CC_COLL_CONFIG: ${C_GREEN}${CC_COLL_CONFIG}${C_RESET}"
  println "- CC_INIT_FCN: ${C_GREEN}${CC_INIT_FCN}${C_RESET}"
  println "- COMPOSE_FILE_BASE: ${C_GREEN}${COMPOSE_FILE_BASE}${C_RESET}"
  println "- COMPOSE_FILE_COUCH: ${C_GREEN}${COMPOSE_FILE_COUCH}${C_RESET}"
  println "- COMPOSE_FILE_CA: ${C_GREEN}${COMPOSE_FILE_CA}${C_RESET}"
  println "- COMPOSE_PROJECT_NAME: ${C_GREEN}${COMPOSE_PROJECT_NAME}${C_RESET}"
  println "- CC_SRC_LANGUAGE: ${C_GREEN}${CC_SRC_LANGUAGE}${C_RESET}"
  println "- CC_VERSION: ${C_GREEN}${CC_VERSION}${C_RESET}"
  println "- CC_SEQUENCE: ${C_GREEN}${CC_SEQUENCE}${C_RESET}"
  println "- IMAGETAG: ${C_GREEN}${IMAGETAG}${C_RESET}"
  println "- CA_IMAGETAG: ${C_GREEN}${CA_IMAGETAG}${C_RESET}"
  println "- DATABASE: ${C_GREEN}${DATABASE}${C_RESET}"
  println "- FABRIC_CFG_PATH: ${C_GREEN}${FABRIC_CFG_PATH}${C_RESET}"
  println "- VERBOSE: ${C_GREEN}${VERBOSE}${C_RESET}"
  println "- CC_RUNTIME_LANGUAGE: ${C_GREEN}${CC_RUNTIME_LANGUAGE}${C_RESET}"
  println "- PATH: ${C_GREEN}${PATH}${C_RESET}"
fi
