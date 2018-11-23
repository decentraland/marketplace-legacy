const CONTRACT_NAME_TO_TOKEN_SYMBOL = Object.freeze({
  MANAToken: 'MANA',
  LANDRegistry: 'LAND',
  EstateRegistry: 'Estates',
  LANDAuction: 'Auction',
  RCNToken: 'RCN',
  ZILToken: 'ZIL',
  DAIToken: 'DAI',
  KNCToken: 'KNC',
  SNTToken: 'SNT',
  BNBToken: 'BNB',
  ELFToken: 'ELF'
})

export const token = {
  getSymbolByContractName(name) {
    return CONTRACT_NAME_TO_TOKEN_SYMBOL[name]
  }
}
