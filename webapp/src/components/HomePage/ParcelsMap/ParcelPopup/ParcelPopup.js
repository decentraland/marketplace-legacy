import React from 'react'

import { shortenAddress } from 'lib/utils'
import * as parcelUtils from 'lib/parcelUtils'

import './ParcelPopup.css'

export default function ParcelPopup(props) {
  const { x, y, parcel } = props

  const className = parcelUtils.getClassName(parcel)

  return (
    <div className="parcel-popup">
      {className && (
        <div className={`header ${className}`}>
          {parcelUtils.getBidStatus(parcel)}
        </div>
      )}
      <div className="body">
        <div className="coordinates">
          {x},{y}
        </div>

        {parcel.address && (
          <div className="address-link">{shortenAddress(parcel.address)}</div>
        )}

        <div className="current-bid-status" />

        {parcel.amount && <div className="text mana">{parcel.amount} MANA</div>}
      </div>
    </div>
  )
}
