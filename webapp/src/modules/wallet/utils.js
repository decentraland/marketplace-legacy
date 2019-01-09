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
      ...getLandAuctionContracts(),
      ...getMortgageContracts()
    ],
    eth
  }
}

function getNewERC20Token(name, address) {
  const erc20 = new contracts.ERC20Token(address)
  erc20.getContractName = () => {
    return name
  }
  return erc20
}

function getLandAuctionContracts() {
  const { LANDAuction } = contracts
  const LANDAuctionContract = new LANDAuction(
    env.get('REACT_APP_LAND_AUCTION_CONTRACT_ADDRESS')
  )

  if (!isFeatureEnabled('AUCTION')) {
    // If the auction feature is not enabled, we should connect only the auction contract
    return [LANDAuctionContract]
  }

  // ZIL
  const ZILToken = getNewERC20Token(
    'ZILToken',
    env.get('REACT_APP_ZIL_TOKEN_CONTRACT_ADDRESS')
  )

  // DAI
  const DAIToken = getNewERC20Token(
    'DAIToken',
    env.get('REACT_APP_DAI_TOKEN_CONTRACT_ADDRESS')
  )

  // KNC
  const KNCToken = getNewERC20Token(
    'KNCToken',
    env.get('REACT_APP_KNC_TOKEN_CONTRACT_ADDRESS')
  )

  // SNT
  const SNTToken = getNewERC20Token(
    'SNTToken',
    env.get('REACT_APP_SNT_TOKEN_CONTRACT_ADDRESS')
  )

  // BNB
  const BNBToken = getNewERC20Token(
    'BNBToken',
    env.get('REACT_APP_BNB_TOKEN_CONTRACT_ADDRESS')
  )

  // ELF
  const ELFToken = getNewERC20Token(
    'ELFToken',
    env.get('REACT_APP_ELF_TOKEN_CONTRACT_ADDRESS')
  )

  // MKR
  const MKRToken = getNewERC20Token(
    'MKRToken',
    env.get('REACT_APP_MKR_TOKEN_CONTRACT_ADDRESS')
  )

  return [
    LANDAuctionContract,
    ZILToken,
    DAIToken,
    KNCToken,
    SNTToken,
    BNBToken,
    ELFToken,
    MKRToken
  ]
}

function getMortgageContracts() {
  const { MortgageHelper, MortgageManager, RCNEngine } = contracts

  const RCNToken = new contracts.ERC20Token(
    env.get('REACT_APP_RCN_TOKEN_CONTRACT_ADDRESS')
  )

  RCNToken.getContractName = () => {
    return 'RCNToken'
  }

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
  return balanceInWei ? eth.utils.fromWei(balanceInWei.toString(10)) : '0'
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
  const landRegistry = eth.getContract('LANDRegistry')
  const tokenId = await landRegistry.encodeTokenId(x, y)
  return landRegistry.updateOperator(tokenId)
}

async function getEstateUpdateOperator(tokenId) {
  const estateRegistry = eth.getContract('EstateRegistry')
  return estateRegistry.updateOperator(tokenId)
}
