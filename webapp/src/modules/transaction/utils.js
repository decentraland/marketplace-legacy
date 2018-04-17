// Special flag used to determine transaction hashes to be monitored
const TRANSACTION_ACTION_FLAG = 'watch_tx'

export function isTransactionAction(action) {
  return !!getTransactionFromAction(action)
}

export function getTransactionFromAction(action) {
  return action[TRANSACTION_ACTION_FLAG]
}

export function getTransactionHashFromAction(action) {
  return getTransactionFromAction(action).hash
}

export function buildTransactionAction(hash, payload = {}, events = []) {
  return {
    [TRANSACTION_ACTION_FLAG]: {
      hash,
      payload,
      events
    }
  }
}

export function isTransactionRejectedError(message) {
  // "Recommended" way to check for rejections
  // https://github.com/MetaMask/faq/issues/6#issuecomment-264900031
  return message.includes('User denied transaction signature')
}

export function getEtherscanHref({ txHash, address, blockNumber }, network) {
  const pathname = address
    ? `/address/${address}`
    : blockNumber ? `/block/${blockNumber}` : `/tx/${txHash}`

  return `${getEtherscanOrigin(network)}${pathname}`
}

export function getEtherscanOrigin(network) {
  let origin = 'https://etherscan.io'
  if (network && network !== 'mainnet') {
    origin = `https://${network}.etherscan.io`
  }
  return origin
}
