import { w3cwebsocket } from 'websocket'
import { eth, contracts } from 'decentraland-eth'
import { env } from 'decentraland-commons'
// @nacho hack: eth-connect expects to have window defined
global.window = {}
const providers = require('eth-connect')

let isLoaded = false
export let contractsData // { ContractName: { address, eventNames: [] } }
export let contractNames // [ContractName, ...]
export let contractAddresses // ContractName: address
export let eventNames // eventName: eventName

export async function connectEth(options = {}) {
  if (!isLoaded) loadContracts()

  const contractsToConnect = []
  for (const contractName in contractsData) {
    const contract = contractsData[contractName]
    if (!contracts[contractName]) {
      throw new Error(`Contract ${contractName} does not exist`)
    }
    contractsToConnect.push(new contracts[contractName](contract.address))
  }

  let provider

  if (options.isWebsocket) {
    const websocketURL = env.get('WEB_SOCKET_RPC_URL')
    if (!websocketURL) {
      throw new Error(
        'You need to set the WEB_SOCKET_RPC_URL env var to connect via websockets'
      )
    }

    provider = new providers.WebSocketProvider(websocketURL, {
      WebSocketConstructor: w3cwebsocket
    })
    await provider.connection
  } else {
    provider = env.get('RPC_URL')
  }

  await eth.connect({
    contracts: contractsToConnect,
    provider
  })

  return contractsData
}

export function loadContracts() {
  contractsData = Object.freeze({
    MANAToken: {
      address: getEnvAddress('MANA_TOKEN_CONTRACT_ADDRESS'),
      eventNames: ['Approval']
    },
    LegacyMarketplace: {
      address: getEnvAddress('LEGACY_MARKETPLACE_CONTRACT_ADDRESS'),
      eventNames: ['AuctionCreated', 'AuctionSuccessful', 'AuctionCancelled']
    },
    Marketplace: {
      address: getEnvAddress('MARKETPLACE_CONTRACT_ADDRESS'),
      eventNames: ['OrderCreated', 'OrderSuccessful', 'OrderCancelled']
    },
    LANDRegistry: {
      address: getEnvAddress('LAND_REGISTRY_CONTRACT_ADDRESS'),
      eventNames: [
        'Update',
        'Transfer',
        'UpdateOperator',
        'UpdateManager',
        'Approval',
        'ApprovalForAll'
      ],
      count: { Transfer: 3 }
    },
    EstateRegistry: {
      address: getEnvAddress('ESTATE_REGISTRY_CONTRACT_ADDRESS'),
      eventNames: [
        'CreateEstate',
        'AddLand',
        'RemoveLand',
        'Transfer',
        'Update',
        'UpdateOperator',
        'Approval',
        'ApprovalForAll',
        'UpdateManager'
      ]
    },
    LANDAuction: {
      address: getEnvAddress('LAND_AUCTION_CONTRACT_ADDRESS'),
      eventNames: ['BidSuccessful']
    },
    MortgageHelper: {
      address: getEnvAddress('MORTGAGE_HELPER_CONTRACT_ADDRESS'),
      eventNames: ['NewMortgage']
    },
    MortgageManager: {
      address: getEnvAddress('MORTGAGE_MANAGER_CONTRACT_ADDRESS'),
      eventNames: [
        'CanceledMortgage',
        'StartedMortgage',
        'PaidMortgage',
        'DefaultedMortgage'
      ]
    },
    RCNEngine: {
      address: getEnvAddress('RCN_ENGINE_CONTRACT_ADDRESS'),
      eventNames: ['PartialPayment', 'TotalPayment']
    },
    DecentralandInvite: {
      address: getEnvAddress('DECENTRALAND_INVITE_CONTRACT_ADDRESS'),
      eventNames: ['Transfer']
    },
    ERC721Bid: {
      address: getEnvAddress('ERC721_BID_CONTRACT_ADDRESS'),
      eventNames: ['BidCreated', 'BidAccepted', 'BidCancelled']
    },
    AvatarNameRegistry: {
      address: getEnvAddress('AVATAR_NAME_REGISTRY_CONTRACT_ADDRESS'),
      eventNames: ['Register', 'MetadataChanged']
    }
  })

  contractNames = Object.keys(contractsData)

  contractAddresses = contractNames.reduce(
    (contractAddresses, contractName) => ({
      ...contractAddresses,
      [contractName]: contractsData[contractName].address
    }),
    {}
  )

  eventNames = contractNames.reduce((eventNames, contractName) => {
    contractsData[contractName].eventNames.forEach(
      eventName => (eventNames[eventName] = eventName)
    )
    return eventNames
  }, {})

  isLoaded = true
}

function getEnvAddress(name) {
  const value = env.get(name)
  if (!value) {
    throw new Error(`Could not find env ${name}`)
  }
  return value.toLowerCase()
}

export function getCountOfEvents(contractName, eventName) {
  if (!contractsData[contractName].count) {
    return 1
  }

  const types = contractsData[contractName].count

  return types[eventName] || 1
}
