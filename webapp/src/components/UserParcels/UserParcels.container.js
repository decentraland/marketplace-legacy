import { connect } from 'react-redux'
import { selectors } from 'reducers'
import { editParcel } from 'actions'

import UserParcels from './UserParcels'

const mapState = state => {
  const userParcels = selectors.getUserParcels(state)
  return {
    isLoading: userParcels.loading,
    userParcels: userParcels.data
  }
}

const mapDispatch = dispatch => ({
  onEdit: parcel => dispatch(editParcel(parcel))
})

export default connect(mapState, mapDispatch)(UserParcels)
