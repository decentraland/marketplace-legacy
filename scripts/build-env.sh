#!/bin/bash

ADDRESS_FILE="addresses.json"
NETWORK=$1

function nodeenv_from_network() {
  if [ $1 == "mainnet" ]
  then
    echo "production"
  else
    echo "development"
  fi
}

function get_config_item() {
  echo `jq .${NETWORK}.$1 ${ADDRESS_FILE}`
}

echo "NODE_ENV=\"$(nodeenv_from_network $1)\""
echo "WEBAPP_PATH=\"../webapp/build\""
echo "CONNECTION_STRING=\"$2\""
echo "RPC_URL=\"$3\""
echo "NEW_RELIC_LICENSE_KEY=\"$4\""
echo "PROCESS_EVENTS_DELAY=30000"
echo "LAND_REGISTRY_CONTRACT_ADDRESS=$(get_config_item 'LANDProxy')"
echo "LEGACY_MARKETPLACE_CONTRACT_ADDRESS=$(get_config_item 'LegacyMarketplace')"
echo "MARKETPLACE_CONTRACT_ADDRESS=$(get_config_item 'Marketplace')"
echo "MORTGAGE_HELPER_CONTRACT_ADDRESS=$(get_config_item 'MortgageHelper')"
echo "MORTGAGE_MANAGER_CONTRACT_ADDRESS=$(get_config_item 'MortgageManager')"
echo "RCN_ENGINE_CONTRACT_ADDRESS=$(get_config_item 'RCNEngine')"
