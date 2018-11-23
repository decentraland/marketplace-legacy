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

const TOKEN_SYMBOL_TO_CONTRACT_NAME = Object.keys(
  CONTRACT_NAME_TO_TOKEN_SYMBOL
).reduce(
  (obj, contractName) => ({
    ...obj,
    [CONTRACT_NAME_TO_TOKEN_SYMBOL[contractName]]: contractName
  }),
  {}
)

export const token = {
  getSymbolByContractName(name) {
    return CONTRACT_NAME_TO_TOKEN_SYMBOL[name]
  },
  getContractNameBySymbol(symbol) {
    return TOKEN_SYMBOL_TO_CONTRACT_NAME[symbol]
  }
}
