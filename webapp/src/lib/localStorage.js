import {
  ALLOW_TOKEN_SUCCESS,
  APPROVE_TOKEN_SUCCESS
} from 'modules/authorization/actions'

export const migrations = {
  2: data => {
    const transaction = data.transaction
    if (transaction) {
      transaction.data = transaction.data.map(tx => {
        return {
          ...tx,
          receipt: null // Remove previous receipt. Will save them on demand
        }
      })
    }
    return { ...data, transaction }
  },
  3: data => {
    const APPROVE_MANA_SUCCESS = '[Success] Approve MANA'
    const AUTHORIZE_LAND_SUCCESS = '[Success] Authorize LAND'
    const transaction = data.transaction

    if (transaction) {
      transaction.data = transaction.data.map(tx => {
        if (tx.actionType === APPROVE_MANA_SUCCESS) {
          tx.payload = {
            amount: tx.payload.mana,
            address: tx.from,
            contractName: 'Marketplace',
            tokenContractName: 'MANAToken'
          }
          tx.actionType = ALLOW_TOKEN_SUCCESS
        } else if (tx.actionType === AUTHORIZE_LAND_SUCCESS) {
          tx.payload = {
            isApproved: tx.payload.isAuthorized,
            address: tx.from,
            contractName: 'Marketplace',
            tokenContractName: 'LANDRegistry'
          }
          tx.actionType = APPROVE_TOKEN_SUCCESS
        }

        return tx
      })
    }
    return { ...data, transaction }
  }
}
