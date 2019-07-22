import React from 'react'
import PropTypes from 'prop-types'

import Mana from 'components/Mana'
import { t } from '@dapps/modules/translation/utils'
import './Popup.css'

export default class Popup extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.string
  }

  render() {
    const {
      x,
      y,
      color,
      backgroundColor,
      label,
      description,
      price
    } = this.props

    return (
      <div className="Popup">
        <div className="header" style={{ color, backgroundColor }}>
          <span>
            {x},{y}
          </span>
        </div>
        <div className="body">
          {label ? <div className="text label">{label}</div> : null}
          {description && !price ? (
            <div className="text description">{description}</div>
          ) : null}
          {price ? (
            <div className="text publication">
              {t('atlas.on_sale')}
              <Mana amount={parseFloat(price)} />
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}
