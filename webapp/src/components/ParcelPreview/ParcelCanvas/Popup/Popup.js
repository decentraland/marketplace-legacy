import React from 'react'

import Mana from 'components/Mana'
import { t } from '@dapps/modules/translation/utils'
import './Popup.css'

export default function Popup(props) {
  const {
    x,
    y,
    color,
    backgroundColor,
    label,
    description,
    publication
  } = props

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
        {description && !publication ? (
          <div className="text description">{description}</div>
        ) : null}
        {publication ? (
          <div className="text publication">
            {t('atlas.on_sale')}
            <Mana amount={parseFloat(publication.price)} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
