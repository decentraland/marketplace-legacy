import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import locations from '../locations'
import { buildCoordinate } from '../lib/utils'

import Icon from './Icon'

import './UserParcels.css'

// TODO: This file contains a plethora of components. They should be extracted

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

  finishEditing = parcel => {
    this.setState({ editing: false })
    this.props.onEdit(parcel)
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

class ParcelRowEdit extends React.Component {
  constructor(props) {
    super(props)

    const { name, description } = props.parcel
    this.state = { name, description }
  }

  getOnChange(stateName) {
    return event =>
      this.setState({
        [stateName]: event.currentTarget.value
      })
  }

  finishEditing = () => {
    const { parcel } = this.props
    const { name, description } = this.state

    this.props.finishEditing({
      ...parcel,
      name,
      description
    })
  }

  render() {
    const { parcel } = this.props
    const { name, description } = this.state

    return (
      <div className="parcel-row-editing">
        <div className="col col-editing">
          Editing&nbsp;&nbsp;
          <CoordinateLink parcel={parcel} />
        </div>
        <div className="col col-actions" onClick={this.finishEditing}>
          <Icon name="tick" />
          Done
        </div>

        <form action="POST" onSubmit={this.finishEditing}>
          <div className="editing-fields">
            <div className="field">
              <label htmlFor="name-field">NAME</label>
              <input
                type="text"
                name="name-field"
                id="name-field"
                value={name}
                onChange={this.getOnChange('name')}
              />
            </div>

            <div className="field">
              <label htmlFor="description-field">DESCRIPTION</label>
              <textarea
                name="description"
                id="description-field"
                value={description}
                onChange={this.getOnChange('description')}
              />
            </div>
          </div>
        </form>
      </div>
    )
  }
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
