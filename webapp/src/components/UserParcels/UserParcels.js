import React from 'react'
import PropTypes from 'prop-types'

import ParcelTable from './ParcelTable'
import './UserParcels.css'

export default function UserParcels({ userParcels, onEdit }) {
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

UserParcels.propTypes = {
  userParcels: PropTypes.array,
  onEdit: PropTypes.func
}
