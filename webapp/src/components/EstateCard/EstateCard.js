import React from 'react'
import PropTypes from 'prop-types'

import { Card } from 'semantic-ui-react'
import ParcelPreview from 'components/ParcelPreview'
import { estateType } from 'components/types'
import { t } from 'modules/translation/utils'
import { calculateZoomAndCenter } from 'modules/estates/utils'

import './EstateCard.css'

export default class EstateCard extends React.PureComponent {
  static propTypes = {
    estate: estateType,
    debounce: PropTypes.number
  }

  render() {
    const { estate, debounce } = this.props
    const { center, zoom } = calculateZoomAndCenter(estate.parcels)
    const { x, y } = center

    const estateName = estate.data.name || t('global.estate')

    return (
      <Card className="ParcelCard">
        <div className="preview">
          <ParcelPreview
            x={x}
            y={y}
            zoom={zoom}
            debounce={debounce}
            size={12}
            selected={estate.parcels}
          />
        </div>
        <Card.Content className="body">
          <Card.Description title={estateName}>
            <span className="name">{estateName}</span>
          </Card.Description>
        </Card.Content>
      </Card>
    )
  }
}
