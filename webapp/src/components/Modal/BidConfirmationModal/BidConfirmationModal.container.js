import { connect } from 'react-redux'
import { txUtils } from 'decentraland-eth'
import { getAddress } from '@dapps/modules/wallet/selectors'
import {
  getPendingTransactions,
  getTransactionHistory
} from '@dapps/modules/transaction/selectors'

import { bidOnParcelsRequest } from 'modules/auction/actions'
import { closeModal } from 'modules/ui/actions'
import {
  getSelectedToken,
  getParams,
  getRate,
  getParcelsForConfirmation
} from 'modules/auction/selectors'
import {
  allowTokenRequest,
  ALLOW_TOKEN_SUCCESS
} from 'modules/authorization/actions'
import { getAuthorizations } from 'modules/authorization/selectors'
import { getModal } from 'modules/ui/selectors'
import { getTokenAmountToApprove } from 'modules/wallet/utils'
import { token as tokenHelper } from 'lib/token'
import BidConfirmationModal from './BidConfirmationModal'

const mapState = state => {
  const { beneficiary } = getModal(state).data || {}
  const parcels = getParcelsForConfirmation(state)
  const address = getAddress(state)
  const token = getSelectedToken(state)

  // check if is authorized
  const authorizations = getAuthorizations(state)
  const isAuthorized =
    !!authorizations &&
    !!authorizations.allowances &&
    authorizations.allowances.LANDAuction[
      tokenHelper.getContractNameBySymbol(token)
    ] > 0

  // check if is authorizing
  const pendingTransactions = getPendingTransactions(state, address)
  const isAuthorizing = pendingTransactions.some(
    tx =>
      tx.actionType === ALLOW_TOKEN_SUCCESS &&
      tx.payload.contractName === 'LANDAuction' &&
      tx.payload.tokenContractName.includes(token)
  )

  // check if it failed
  const transactionHistory = getTransactionHistory(state, address)
  const latestTransaction = transactionHistory.pop()
  const hasError =
    !isAuthorizing &&
    latestTransaction != null &&
    latestTransaction.status === txUtils.TRANSACTION_TYPES.reverted

  // compute price
  const { currentPrice } = getParams(state)
  const rate = getRate(state)
  const price = Number((currentPrice * rate * parcels.length).toFixed(2))

  return {
    token,
    price,
    parcels,
    beneficiary,
    isAuthorizing,
    isAuthorized,
    hasError
  }
}

const mapDispatch = dispatch => ({
  onSubmit: (parcels, beneficiary) =>
    dispatch(bidOnParcelsRequest(parcels, beneficiary)),
  onAuthorize: token =>
    dispatch(
      allowTokenRequest(
        getTokenAmountToApprove(),
        'LANDAuction',
        tokenHelper.getContractNameBySymbol(token)
      )
    ),
  onClose: () => dispatch(closeModal())
})

export default connect(mapState, mapDispatch)(BidConfirmationModal)
