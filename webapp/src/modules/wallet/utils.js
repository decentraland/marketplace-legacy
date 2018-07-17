import { eth, contracts, wallets, Contract } from 'decentraland-eth'
import { env, utils } from 'decentraland-commons'
import { isMobile } from 'lib/utils'

export async function connectEthereumWallet(options = {}, retries = 0) {
  try {
    const {
      MANAToken,
      LANDRegistry,
      Marketplace,
      MortgageHelper,
      MortgageManager,
      RCNEngine,
      ERC20Token
    } = contracts

    const RCNToken = Object.create(
      new ERC20Token(env.get('REACT_APP_RCN_TOKEN_CONTRACT_ADDRESS'))
    )
    RCNToken.getContractName = () => 'RCNToken'

    const { LedgerWallet, NodeWallet } = wallets
    const { address, derivationPath } = options

    await eth.connect({
      provider: env.get('REACT_APP_PROVIDER_URL'),
      contracts: [
        new MANAToken(env.get('REACT_APP_MANA_TOKEN_CONTRACT_ADDRESS')),
        new LANDRegistry(env.get('REACT_APP_LAND_REGISTRY_CONTRACT_ADDRESS')),
        new Marketplace(env.get('REACT_APP_MARKETPLACE_CONTRACT_ADDRESS')),
        new MortgageHelper(
          env.get('REACT_APP_MORTGAGE_HELPER_CONTRACT_ADDRESS')
        ),
        new MortgageManager(
          env.get('REACT_APP_MORTGAGE_MANAGER_CONTRACT_ADDRESS')
        ),
        new RCNEngine(env.get('REACT_APP_RCN_ENGINE_CONTRACT_ADDRESS')),
        RCNToken
      ],
      wallets: isMobile()
        ? [new NodeWallet(address)]
        : [
            retries < 3
              ? new NodeWallet(address)
              : new LedgerWallet(address, derivationPath)
          ]
    })
    eth.wallet.getAccount() // throws on empty accounts
  } catch (error) {
    if (retries >= 5) {
      console.warn(
        `Error trying to connect to Ethereum for the ${retries}th time`,
        error
      )
      throw error
    }
    await utils.sleep(125)
    return connectEthereumWallet(options, retries + 1)
  }
}

export function isLedgerWallet() {
  return eth.wallet instanceof wallets.LedgerWallet
}

export function getManaToApprove() {
  return Math.pow(2, 180)
}

export function getRCNToApprove() {
  return Math.pow(2, 180)
}

export function getMarketplaceAddress() {
  const marketplaceContract = eth.getContract('Marketplace')
  return marketplaceContract.address
}

export function getMortgageHelperAddress() {
  const mortgageHelperContract = eth.getContract('MortgageHelper')
  return mortgageHelperContract.address
}

export function getMortgageManagerAddress() {
  const mortgageManagerContract = eth.getContract('MortgageManager')
  return mortgageManagerContract.address
}

export function getRCNEngineAddress() {
  const rcnEngineContract = eth.getContract('RCNEngine')
  return rcnEngineContract.address
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
  const balance = eth.utils.fromWei(balanceInWei.toString(10))
  return balance
}

export async function getUpdateOperator(x, y) {
  try {
    const contract = eth.getContract('LANDRegistry')
    const assetId = await contract.encodeTokenId(x, y)
    const address = await contract.updateOperator(assetId)
    if (
      eth.utils.isValidAddress(address) &&
      !Contract.isEmptyAddress(address)
    ) {
      return address
    }
  } catch (error) {
    // 🌈
  }
  return null
}
