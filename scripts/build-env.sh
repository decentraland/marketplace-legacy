#!/bin/bash

CONTRACTS_CONFIG_URL="https://contracts.decentraland.org/addresses.json"
CONTRACTS_CONFIG_FILE="addresses.json"
NETWORK=$1

function fetch_contracts_config() {
  `wget --quiet ${CONTRACTS_CONFIG_URL} -O ${CONTRACTS_CONFIG_FILE}`
}

function nodeenv_from_network() {
  if [ $1 == "mainnet" ]
  then
    echo "production"
  else
    echo "development"
  fi
}

function get_config_item() {
  echo `jq .${NETWORK}.$1 ${CONTRACTS_CONFIG_FILE}`
}

function create_config_file() {
  echo "NODE_ENV=\"$(nodeenv_from_network $1)\""
  echo "WEBAPP_PATH=\"../webapp/build\""

  echo "# Database"

  echo "CONNECTION_STRING=\"$2\""

  echo "# General"

  echo "NEW_RELIC_LICENSE_KEY=\"$4\""

  echo "CORS_ORIGIN=\"*\""
  echo "CORS_METHOD=\"*\""

  echo "AUCTION_PARCEL_COUNT=0"

  echo "# Ethereum"

  echo "RPC_URL=\"$3\""
  echo "WEB_SOCKET_RPC_URL=\"$3\""
  echo "BLOCK_STEP=200000"

  echo "# Monitor"

  echo "PROCESS_EVENTS_DELAY=10000"
  echo "CACHE_TILES=1"

  echo "# Contracts"

  echo "MANA_TOKEN_CONTRACT_ADDRESS=$(get_config_item 'MANAToken')"

  echo "LAND_REGISTRY_CONTRACT_ADDRESS=$(get_config_item 'LANDProxy')"
  echo "ESTATE_REGISTRY_CONTRACT_ADDRESS=$(get_config_item 'EstateProxy')"

  echo "LEGACY_MARKETPLACE_CONTRACT_ADDRESS=$(get_config_item 'LegacyMarketplace')"
  echo "MARKETPLACE_CONTRACT_ADDRESS=$(get_config_item 'Marketplace')"

  echo "MORTGAGE_HELPER_CONTRACT_ADDRESS=$(get_config_item 'MortgageHelper')"
  echo "MORTGAGE_MANAGER_CONTRACT_ADDRESS=$(get_config_item 'MortgageManager')"
  echo "RCN_ENGINE_CONTRACT_ADDRESS=$(get_config_item 'RCNEngine')"

  echo "LAND_AUCTION_CONTRACT_ADDRESS=$(get_config_item 'LANDAuction')"
  echo "DECENTRALAND_INVITE_CONTRACT_ADDRESS=$(get_config_item 'DecentralandInvite')"
  echo "ERC721_BID_CONTRACT_ADDRESS=$(get_config_item 'ERC721Bid')"
  echo "AVATAR_NAME_REGISTRY_CONTRACT_ADDRESS=$(get_config_item 'AvatarNameRegistryProxy')"
}

fetch_contracts_config
create_config_file "$@"
