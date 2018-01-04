import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectors } from '../reducers'
import { editParcel } from '../actions'
import { stateData } from '../lib/propTypes'

import UserParcels from '../components/UserParcels'
import Loading from '../components/Loading'

class UserParcelsContainer extends React.Component {
  static propTypes = {
    userParcels: stateData(PropTypes.array),
    editParcel: PropTypes.func
  }

  onEdit = parcel => {
    this.props.editParcel(parcel)
  }

  render() {
    const { userParcels } = this.props

    return userParcels.loading ? (
      <Loading />
    ) : (
      <UserParcels userParcels={userParcels.data} onEdit={this.onEdit} />
    )
  }
}

export default connect(
  state => ({
    userParcels: selectors.getUserParcels(state)
  }),
  { editParcel }
)(UserParcelsContainer)
