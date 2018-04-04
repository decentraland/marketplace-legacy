import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import {
  getWallet,
  isConnecting,
  isConnected,
  isTransferManaTransactionIdle
} from 'modules/wallet/selectors'
import { locations } from 'locations'

import TransferManaPage from './TransferManaPage'
import { transferManaRequest } from '../../modules/wallet/actions'

const mapState = state => {
  return {
    wallet: getWallet(state),
    isLoading: isConnecting(state),
    isConnected: isConnected(state),
    isTxIdle: isTransferManaTransactionIdle(state)
  }
}

const mapDispatch = dispatch => ({
  onSubmit: ({ amount, address }) =>
    dispatch(transferManaRequest(address, amount)),
  onCancel: () => dispatch(replace(locations.settings))
})

export default withRouter(connect(mapState, mapDispatch)(TransferManaPage))
