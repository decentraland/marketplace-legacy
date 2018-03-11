import { connect } from 'react-redux'
import { isConnected } from 'modules/wallet/selectors'
import ParcelPublication from './ParcelPublication'

const mapState = (state, { parcel }) => {
  return {
    isConnected: isConnected(state)
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(ParcelPublication)
