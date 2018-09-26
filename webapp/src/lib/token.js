const CONTRACT_NAME_TO_TOKEN_SYMBOL = Object.freeze({
  MANAToken: 'MANA',
  LANDRegistry: 'LAND',
  EstateRegistry: 'Estates',
  RCNToken: 'RCN'
})

export const token = {
  getSymbolByContractName(name) {
    return CONTRACT_NAME_TO_TOKEN_SYMBOL[name]
  }
}
