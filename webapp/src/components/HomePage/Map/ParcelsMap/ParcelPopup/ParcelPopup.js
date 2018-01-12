import React from 'react'

import { shortenAddress } from 'lib/utils'
import * as parcelUtils from 'lib/parcelUtils'

import './ParcelPopup.css'

export default function ParcelPopup(props) {
  const { x, y, owner, price, color, backgroundColor, label, district } = props

  return (
    <div className="parcel-popup">
      {label && (
        <div className={`header`} style={{ color, backgroundColor }}>
          <span>{label}</span>
        </div>
      )}
      <div className="body">
        <div className="coordinates">
          {x},{y}
        </div>

        {owner && <div className="address-link">{shortenAddress(owner)}</div>}

        {price && <div className="text mana">{price} MANA</div>}

        {district &&
          district.name !== 'Roads' &&
          district.name !== 'Genesis Plaza' && (
            <div className="text mana">{district.name}</div>
          )}
      </div>
    </div>
  )
}
