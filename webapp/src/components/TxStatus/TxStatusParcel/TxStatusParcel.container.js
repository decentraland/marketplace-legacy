import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { txUtils } from 'decentraland-commons'

import { getParcels } from 'modules/parcels/selectors'
import { getData as getTransactions } from 'modules/parcels/selectors'
import { buildCoordinate } from 'lib/utils'

import TxStatusParcel from './TxStatusParcel'

const mapState = (state, { x, y }) => {
  const parcels = getParcels(state)
  const parcel = parcels[buildCoordinate(x, y)]

  const transactions = getTransactions(state)
    .filter(tx => tx.payload.parcel.x == x && tx.payload.parcel.y == y)
    .filter(tx => tx.status === txUtils.TRANSACTION_STATUS.confirmed)

  return {
    parcel,
    transactions
  }
}

const mapDispatch = () => ({})

export default withRouter(connect(mapState, mapDispatch)(TxStatusParcel))
