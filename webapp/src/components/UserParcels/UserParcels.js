import React from 'react'
import PropTypes from 'prop-types'

import ParcelTable from './ParcelTable'
import './UserParcels.css'

class UserParcels extends React.PureComponent {
  render() {
    const { userParcels, onEdit } = this.props
    return (
      <div className="UserParcels">
        <div className="heading">
          My Land&nbsp;
          <span className="parcel-count">{userParcels.length} parcels</span>
        </div>

        <ParcelTable parcels={userParcels} onEdit={onEdit} />
      </div>
    )
  }
}

UserParcels.propTypes = {
  userParcels: PropTypes.array,
  onEdit: PropTypes.func
}

export default UserParcels
