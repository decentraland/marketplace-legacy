import {
  buildTransactionPayload,
  buildTransactionWithReceiptPayload
} from '@dapps/modules/transaction/utils'

export function buildTransactionAction(hash, payload = {}, events = []) {
  return {
    payload: {
      ...buildTransactionPayload(hash, payload, events)
    }
  }
}

export function buildTransactionWithReceiptAction(
  hash,
  payload = {},
  events = []
) {
  return {
    payload: {
      ...buildTransactionWithReceiptPayload(hash, payload, events)
    }
  }
}
