import React from 'react'

import './ParcelPopup.css'

export default function ParcelPopup(props) {
  let { x, y, color, backgroundColor, label, description } = props

  return (
    <div className="parcel-popup">
      {
        <div className={`header`} style={{ color, backgroundColor }}>
          <span>
            {x},{y}
          </span>
        </div>
      }
      <div className="body">{<div className="text">{label}</div>}</div>
      {description && (
        <div className="body">
          {<div className="text mana">{description}</div>}
        </div>
      )}
    </div>
  )
}
