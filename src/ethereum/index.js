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
    LegacyMarketplace: {
      address: env.get('LEGACY_MARKETPLACE_CONTRACT_ADDRESS').toLowerCase(),
      eventNames: ['AuctionCreated', 'AuctionSuccessful', 'AuctionCancelled']
    },
    Marketplace: {
      address: env.get('MARKETPLACE_CONTRACT_ADDRESS').toLowerCase(),
      eventNames: ['OrderCreated', 'OrderSuccessful', 'OrderCancelled']
    },
    LANDRegistry: {
      address: env.get('LAND_REGISTRY_CONTRACT_ADDRESS').toLowerCase(),
      eventNames: ['Update', 'Transfer', 'UpdateOperator']
    },
    EstateRegistry: {
      address: env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS').toLowerCase(),
      eventNames: [
        'CreateEstate',
        'AddLand',
        'RemoveLand',
        'Transfer',
        'Update',
        'UpdateOperator'
      ]
    },
    // LANDAuction: {
    //   address: env.get('LAND_AUCTION_CONTRACT_ADDRESS').toLowerCase(),
    //   eventNames: [
    //     // TODO: Listen to bid event
    //   ]
    // },
    MortgageHelper: {
      address: env.get('MORTGAGE_HELPER_CONTRACT_ADDRESS').toLowerCase(),
      eventNames: ['NewMortgage']
    },
    MortgageManager: {
      address: env.get('MORTGAGE_MANAGER_CONTRACT_ADDRESS').toLowerCase(),
      eventNames: [
        'CanceledMortgage',
        'StartedMortgage',
        'PaidMortgage',
        'DefaultedMortgage'
      ]
    },
    RCNEngine: {
      address: env.get('RCN_ENGINE_CONTRACT_ADDRESS').toLowerCase(),
      eventNames: ['PartialPayment', 'TotalPayment']
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
