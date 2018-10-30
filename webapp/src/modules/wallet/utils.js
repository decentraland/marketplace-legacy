import { eth, contracts, Contract } from 'decentraland-eth'
import { env, utils } from 'decentraland-commons'
import { isFeatureEnabled } from 'lib/featureUtils'
import { isParcel } from 'shared/parcel'
import { isEstate } from 'shared/estate'

export function getWalletSagaOptions() {
  const {
    MANAToken,
    LANDRegistry,
    LegacyMarketplace,
    Marketplace,
    EstateRegistry
  } = contracts

  // TODO: Remove this once LANDAuction exists on decentraland-eth
  const LANDAuction = Object.create(
    new Contract(env.get('REACT_APP_LAND_AUCTION_CONTRACT_ADDRESS'), [])
  )
  LANDAuction.getContractName = () => 'LANDAuction'
  LANDAuction.getCurrentLandPrice = () => Promise.resolve(5500)
  LANDAuction.bid = (x, y) => Promise.resolve()

  return {
    provider: env.get('REACT_APP_PROVIDER_URL'),
    contracts: [
      new MANAToken(env.get('REACT_APP_MANA_TOKEN_CONTRACT_ADDRESS')),
      new LANDRegistry(env.get('REACT_APP_LAND_REGISTRY_CONTRACT_ADDRESS')),
      new LegacyMarketplace(
        env.get('REACT_APP_LEGACY_MARKETPLACE_CONTRACT_ADDRESS')
      ),
      new Marketplace(env.get('REACT_APP_MARKETPLACE_CONTRACT_ADDRESS')),
      new EstateRegistry(env.get('REACT_APP_ESTATE_REGISTRY_CONTRACT_ADDRESS')),
      LANDAuction,
      ...getMortgageContracts()
    ],
    eth
  }
}

function getMortgageContracts() {
  // Condition should be deleted when mortgages go live
  if (!isFeatureEnabled('MORTGAGES')) return []

  const { MortgageHelper, MortgageManager, RCNEngine, ERC20Token } = contracts

  const RCNToken = Object.create(
    new ERC20Token(env.get('REACT_APP_RCN_TOKEN_CONTRACT_ADDRESS'))
  )
  RCNToken.getContractName = () => 'RCNToken'

  return [
    new MortgageHelper(env.get('REACT_APP_MORTGAGE_HELPER_CONTRACT_ADDRESS')),
    new MortgageManager(env.get('REACT_APP_MORTGAGE_MANAGER_CONTRACT_ADDRESS')),
    new RCNEngine(env.get('REACT_APP_RCN_ENGINE_CONTRACT_ADDRESS')),
    RCNToken
  ]
}

export function getTokenAmountToApprove() {
  return Math.pow(2, 180)
}

export function getContractAddress(contractName) {
  const tokenContract = eth.getContract(contractName)
  return tokenContract.address
}

export function getKyberOracleAddress() {
  return env.get('REACT_APP_KYBER_ORACLE_CONTRACT_ADDRESS')
}

export async function sendTransaction(tx) {
  const web3 = eth.wallet.getWeb3()
  return utils.promisify(web3.eth.sendTransaction)(tx)
}

export async function fetchBalance(address) {
  const web3 = eth.wallet.getWeb3()
  const balanceInWei = await utils.promisify(web3.eth.getBalance)(address)
  return eth.utils.fromWei(balanceInWei.toString(10))
}

export async function getAssetUpdateOperator(asset) {
  try {
    let address
    if (isParcel(asset)) {
      address = await getParcelUpdateOperator(asset.x, asset.y)
    } else if (isEstate(asset)) {
      address = await getEstateUpdateOperator(asset.id)
    }

    if (
      eth.utils.isValidAddress(address) &&
      !Contract.isEmptyAddress(address)
    ) {
      return address
    }
  } catch (error) {
    return null
  }
}

async function getParcelUpdateOperator(x, y) {
  const contract = eth.getContract('LANDRegistry')
  const tokenId = await contract.encodeTokenId(x, y)
  return contract.updateOperator(tokenId)
}

async function getEstateUpdateOperator(tokenId) {
  const contract = eth.getContract('EstateRegistry')
  return contract.updateOperator(tokenId)
}
