import React from 'react'

import './ParcelPopup.css'

export default function ParcelPopup(props) {
  let { x, y, color, backgroundColor, label, description } = props

  return (
    <div className="parcel-popup">
      {
        <div className="header" style={{ color, backgroundColor }}>
          <span>
            {x},{y}
          </span>
        </div>
      }
      <div className="body">
        {label ? <div className="text label">{label}</div> : null}
        {description ? (
          <div className="text description">{description}</div>
        ) : null}
        {/*description && <div className="text description">{description}</div>*/}
      </div>
    </div>
  )
}
