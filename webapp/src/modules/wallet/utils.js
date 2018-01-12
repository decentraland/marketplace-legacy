import { eth, utils } from 'decentraland-commons'

// TODO: The web3 connection was correctly encapsulated in `eth.connect`, imported from `decentraland-commons`
// We later introduced ledger support but only on the sagas, without moving the behaviour to commons.
// We shouldn't leak how the connection works and ideally it should be the same interface for the ledger and web3 objects.
let wallet = null

export async function connectEthereumWallet() {
  let [ledger, browser] = await Promise.all([
    tryConnect(connectLedger),
    tryConnect(connectBrowser)
  ])

  if (!ledger && !browser) throw new Error('Could not connect to web3')

  wallet = ledger || browser
  return wallet
}

export function getWallet() {
  return wallet
}

async function connectLedger(action = {}, retries = 0) {
  // Ledger only works on Chrome apparently
  if (!isChrome()) return null

  const ledger = window.ledger
  const derivationPath = "44'/60'/0'/0"
  const comm = await ledger.comm_u2f.create_async(2)
  const ledgerEth = new ledger.eth(comm)

  // The ledger lib doesn't provide a way to check if the device is connected,
  // so the easiest way is to try fetching the address. It'll throw if it's not possible
  const address = await ledgerEth.getAddress_async(derivationPath)

  return {
    async getAddress() {
      return address.toLowerCase()
    },
    async sign(payload) {
      const message = eth.utils.toHex(payload)
      let { v, r, s } = await ledgerEth.signPersonalMessage_async(
        derivationPath,
        message.substring(2)
      )

      v = (v - 27).toString(16)
      if (v.length < 2) v = '0' + v

      const signature = '0x' + r + s + v
      return { message, signature }
    }
  }
}

async function connectBrowser(action = {}, retries = 0) {
  let connected = await eth.reconnect()
  if (!connected) throw new Error('Could not connect to Ethereum')

  const address = await eth.getAddress()

  return {
    async getAddress() {
      return address.toLowerCase()
    },
    async sign(payload) {
      const message = eth.utils.toHex(payload)
      const signature = await eth.remoteSign(message, address)

      return { message, signature }
    }
  }
}

async function tryConnect(method, retries = 0) {
  try {
    return await method()
  } catch (error) {
    if (retries >= 3) return null

    await utils.sleep(500)
    return tryConnect(method, retries + 1)
  }
}

function isChrome() {
  // Please note, that IE11 now returns `undefined` again for window.chrome,
  // new Opera 30 outputs true for window.chrome,
  // new IE Edge outputs to true for window.chrome
  const isChromium = window.chrome
  const winNav = window.navigator
  const vendorName = winNav.vendor
  const isOpera = winNav.userAgent.indexOf('OPR') > -1
  const isIEedge = winNav.userAgent.indexOf('Edge') > -1
  const isIOSChrome = winNav.userAgent.match('CriOS')

  if (isIOSChrome) {
    return false
  } else if (
    isChromium !== null &&
    typeof isChromium !== 'undefined' &&
    vendorName === 'Google Inc.' &&
    isOpera === false &&
    isIEedge === false
  ) {
    return true
  } else {
    return false
  }
}
