import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import locations from '../locations'
import { buildCoordinate } from '../lib/utils'

import Icon from './Icon'

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

function ParcelTable({ parcels, onEdit }) {
  if (parcels.length) {
    return (
      <div className="table">
        <div className="table-row table-header">
          <div className="col col-coord">COORD</div>
          <div className="col col-price">PURCHASE PRICE</div>
          <div className="col col-name">NAME</div>
          <div className="col col-actions" />
        </div>

        {parcels.map((parcel, index) => (
          <ParcelRow
            key={index}
            parcel={parcel}
            className={index % 2 === 0 ? 'gray' : ''}
            onEdit={onEdit}
          />
        ))}
      </div>
    )
  } else {
    return <div className="table-row-empty">You have no available land yet</div>
  }
}

class ParcelRow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false
    }
  }

  startEditing = () => {
    this.setState({ editing: true })
  }

  finishEditing = () => {
    this.setState({ editing: false })

    this.props.onEdit({
      parcel: 'data'
    })
  }

  render() {
    const { parcel, className } = this.props

    return (
      <div className={className}>
        {this.state.editing ? (
          <ParcelRowEdit parcel={parcel} finishEditing={this.finishEditing} />
        ) : (
          <ParcelRowData parcel={parcel} startEditing={this.startEditing} />
        )}
      </div>
    )
  }
}

function ParcelRowEdit({ parcel, finishEditing }) {
  return (
    <div className="parcel-row-editing">
      <div className="col col-editing">
        Editing&nbsp;&nbsp;
        <CoordinateLink parcel={parcel} />
      </div>
      <div className="col col-actions" onClick={finishEditing}>
        <Icon name="tick" />
        Done
      </div>

      <div className="editing-fields">
        <div className="field">
          <label htmlFor="name-field">NAME</label>
          <input
            type="text"
            name="name-field"
            id="name-field"
            defaultValue={parcel.name}
          />
        </div>

        <div className="field">
          <label htmlFor="description-field">DESCRIPTION</label>
          <textarea
            name="description"
            id="description-field"
            defaultValue={parcel.description}
          />
        </div>
      </div>
    </div>
  )
}

function ParcelRowData({ parcel, startEditing }) {
  return (
    <div className="table-row">
      <div className="col col-coord">
        <CoordinateLink parcel={parcel} />
      </div>
      <div className="col col-price">{parcel.price.toLocaleString()} MANA</div>
      <div className="col col-name">{parcel.name}</div>
      <div className="col col-actions" onClick={startEditing}>
        <Icon name="pencil" />
        Edit
      </div>
    </div>
  )
}

function CoordinateLink({ parcel }) {
  const coord = buildCoordinate(parcel.x, parcel.y)
  return <Link to={locations.parcelDetail(parcel.x, parcel.y)}>{coord}</Link>
}
