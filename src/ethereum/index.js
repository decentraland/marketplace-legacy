import { eth, contracts } from 'decentraland-eth'
import { env } from 'decentraland-commons'

let isLoaded = false

export let contractsData // { ContractName: { address, eventNames: [] } }
export let contractNames // [ContractName, ...]
export let contractAddresses // ContractName: address
export let eventNames // eventName: eventName

export async function connectEth() {
  if (!isLoaded) loadContracts()

  const contractsToConnect = []
  for (const contractName in contractsData) {
    const contract = contractsData[contractName]
    if (!contracts[contractName]) {
      throw new Error(`Contract ${contractName} does not exist`)
    }
    contractsToConnect.push(new contracts[contractName](contract.address))
  }

  await eth.connect({
    contracts: contractsToConnect,
    provider: env.get('RPC_URL')
  })

  return contractsData
}

export function loadContracts() {
  contractsData = Object.freeze({
    MANAToken: {
      address: getEnvAddress('MANA_TOKEN_CONTRACT_ADDRESS'),
      eventNames: []
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
      eventNames: ['Update', 'Transfer', 'UpdateOperator']
    },
    EstateRegistry: {
      address: getEnvAddress('ESTATE_REGISTRY_CONTRACT_ADDRESS'),
      eventNames: [
        'CreateEstate',
        'AddLand',
        'RemoveLand',
        'Transfer',
        'Update',
        'UpdateOperator'
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
