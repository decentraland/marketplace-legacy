import {
  ALLOW_TOKEN_SUCCESS,
  APPROVE_TOKEN_SUCCESS
} from 'modules/authorization/actions'
import {
  CANCEL_SALE_SUCCESS,
  BUY_SUCCESS,
  PUBLISH_SUCCESS
} from 'modules/publication/actions'
import { ASSET_TYPES } from 'shared/asset'

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
  },
  4: data => {
    const OLD_CANCEL_SALE_SUCCESS = '[Success] Cancel LAND Sale'
    const OLD_BUY_SUCCESS = '[Success] Buy LAND'
    const OLD_PUBLISH_SUCCESS = '[Success] Publish LAND'

    const transaction = data.transaction

    if (transaction) {
      transaction.data = transaction.data.map(tx => {
        switch (tx.actionType) {
          case OLD_CANCEL_SALE_SUCCESS:
            tx.payload = {
              ...tx.payload,
              type: ASSET_TYPES.parcel
            }
            tx.actionType = CANCEL_SALE_SUCCESS
            return tx
          case OLD_BUY_SUCCESS:
            tx.payload = {
              ...tx.payload,
              type: ASSET_TYPES.parcel
            }
            tx.actionType = BUY_SUCCESS
            return tx
          case OLD_PUBLISH_SUCCESS:
            tx.payload = {
              ...tx.payload,
              type: ASSET_TYPES.parcel
            }
            tx.actionType = PUBLISH_SUCCESS
            return tx
          default:
            return tx
        }
      })
    }
    return { ...data, transaction }
  }
}
