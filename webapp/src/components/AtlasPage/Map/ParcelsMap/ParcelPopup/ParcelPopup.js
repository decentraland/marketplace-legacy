import React from 'react'

import { formatMana } from 'lib/utils'
import { t } from 'modules/translation/utils'

import './ParcelPopup.css'

export default function ParcelPopup(props) {
  let { x, y, color, backgroundColor, label, description, publication } = props

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
        {publication ? (
          <div className="text description">
            {t('atlas.on_sale')}
            <span className="on-sale">{formatMana(publication.price)}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
