import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import locations from '../locations'
import { buildCoordinate } from '../lib/utils'

import Loading from './Loading'
import Icon from './Icon'

import './ExpandedSidebar.css'

export default function ExpandedSidebar({ userParcels }) {
  return (
    <div className="ExpandedSidebar fadein">
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
  userParcels: PropTypes.object
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
          <div className="col-coord">COORD</div>
          <div className="col-price">PURCHASE PRICE</div>
          <div className="col-name">NAME</div>
          <div className="col-actions" />
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

function ParcelTableRow({ parcel, className }) {
  const coord = buildCoordinate(parcel.x, parcel.y)

  return (
    <div className={`table-row ${className}`}>
      <div className="col-coord">
        <Link to={locations.parcelDetail(parcel.x, parcel.y)}>{coord}</Link>
      </div>
      <div className="col-price">{parcel.price.toLocaleString()} MANA</div>
      <div className="col-name">{parcel.name}</div>
      <div className="col-actions">edit</div>
    </div>
  )
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
