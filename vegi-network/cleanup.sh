#!/bin/bash

source scriptUtils.sh

cleanUpFilesAndPurgeDocker() {
  # Set this, otherwise network name will be referred to as "docker_vegi" instead of "net_vegi"
  export COMPOSE_PROJECT_NAME="net"

  dock1=docker/docker-compose-ca.yaml
  dock2=docker/docker-compose-couch.yaml
  dock3=docker/docker-compose-vegi-net.yaml

  docker-compose -f "$dock1" -f "$dock2" -f "$dock3" down --volumes --remove-orphans
  docker container prune -f
  docker volume prune -f
  sleep 3
  docker network prune -f
  find . -name "*_sk" -delete
  find . -name "*Key" -delete
  find . -name "*.pem" -delete
  find . -name "*.key" -delete
  find . -name "*.crt" -delete
  find . -name "connection-org*" -delete
  find . -name "fabric-ca-server.db" -delete
  find . -name "fabric-ca-client-config.yaml" -delete
  find . -name "config.yaml" -delete
  find . -name "*.block" -delete
  find . -name "*.tx" -delete
  find . -name "*.txt" -delete
  find . -name "*.tar.gz" -delete
  rm -rf ../apps/org1/wallet
  rm -rf ../apps/org2/wallet
  rm -rf ../apps/org3/wallet
  rm -rf ../apps/org4/wallet
  rm -rf ../apps/node_modules
  rm -rf ../apps/package-lock.json
}

cleanUpFilesAndPurgeDocker
res=$?

if [ $res -ne 0 ]; then
  fatalln "Failed to cleanup properly"
else
  infoln "Files, Docker and settings successfully removed"
fi