import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import locations from '../locations'
import { shortenAddress, buildCoordinate } from '../lib/utils'
import { stateData } from '../lib/propTypes'

import Loading from './Loading'
import Icon from './Icon'

import './ExpandedSidebar.css'

export default function ExpandedSidebar({ address, userParcels }) {
  return (
    <div className="ExpandedSidebar fadein">
      <MarketplaceTitle address={address} />

      {userParcels.loading ? (
        <Loading />
      ) : (
        <UserParcels userParcels={userParcels.data} />
      )}

      <Footer />
    </div>
  )
}

ExpandedSidebar.propTypes = {
  address: PropTypes.string,
  userParcels: stateData(PropTypes.array)
}

function MarketplaceTitle({ address }) {
  return (
    <div className="MarketplaceTitle">
      <h2>
        Marketplace
        {address && (
          <div className="address">
            <Icon name="address" />
            {shortenAddress(address)}
          </div>
        )}
      </h2>
    </div>
  )
}

function UserParcels({ userParcels }) {
  return (
    <div className="UserParcels">
      <div className="heading">
        My Land&nbsp;
        <span className="parcel-count">{userParcels.length} parcels</span>
      </div>
      <ParcelTable parcels={userParcels} />
    </div>
  )
}

function ParcelTable({ parcels }) {
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
          <ParcelTableRow
            key={index}
            parcel={parcel}
            className={index % 2 === 0 ? 'gray' : ''}
          />
        ))}
      </div>
    )
  } else {
    return <div className="table-row-empty">You have no available land yet</div>
  }
}

class ParcelTableRow extends React.Component {
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
    // Send to the server
  }

  render() {
    const { parcel, className } = this.props
    const { editing } = this.state

    const coord = buildCoordinate(parcel.x, parcel.y)

    if (editing) {
      return (
        <div className={`table-row table-row-editing ${className}`}>
          <div className="col col-editing">
            Editing&nbsp;&nbsp;
            <Link to={locations.parcelDetail(parcel.x, parcel.y)}>{coord}</Link>
          </div>
          <div className="col col-actions" onClick={this.finishEditing}>
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
    } else {
      return (
        <div className={`table-row ${className}`}>
          <div className="col col-coord">
            <Link to={locations.parcelDetail(parcel.x, parcel.y)}>{coord}</Link>
          </div>
          <div className="col col-price">
            {parcel.price.toLocaleString()} MANA
          </div>
          <div className="col col-name">{parcel.name}</div>
          <div className="col col-actions" onClick={this.startEditing}>
            <Icon name="pencil" />
            Edit
          </div>
        </div>
      )
    }
  }
}

function Footer() {
  return (
    <footer className="Footer">
      <div className="social-icons">
        <Link to="https://twitter.com/decentraland/" target="_blank">
          <Icon name="twitter" />
        </Link>
        <Link to="https://chat.decentraland.org/" target="_blank">
          <Icon name="rocketchat" />
        </Link>
        <Link to="https://github.com/decentraland/" target="_blank">
          <Icon name="github" />
        </Link>
        <Link to="https://reddit.com/r/decentraland/" target="_blank">
          <Icon name="reddit" />
        </Link>
        <Link to="https://www.facebook.com/decentraland/" target="_blank">
          <Icon name="facebook" />
        </Link>
      </div>
      <div className="links">
        <Link to="https://blog.decentraland.org" target="_blank">
          Blog
        </Link>
        <Link to="https://decentraland.org" target="_blank">
          Website
        </Link>
        <Link to="https://decentraland.org/whitepaper.pdf" target="_blank">
          Whitepaper
        </Link>
      </div>
      <div className="copyright">
        Copyright 2017 Decentraland. All rights reserved.
      </div>
    </footer>
  )
}
