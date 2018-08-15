import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Card } from 'semantic-ui-react'
import ParcelPreview from 'components/ParcelPreview'
import ParcelTags from 'components/ParcelTags'
import LandAmount from 'components/LandAmount'
import { estateType } from 'components/types'
import { t } from 'modules/translation/utils'
import { calculateZoomAndCenter } from 'shared/estate'
import { formatDate } from 'lib/utils'
import { locations } from 'locations'

import './EstateCard.css'

export default class EstateCard extends React.PureComponent {
  static propTypes = {
    estate: estateType,
    debounce: PropTypes.number
  }

  render() {
    const { estate, debounce } = this.props
    const { center, zoom } = calculateZoomAndCenter(estate.data.parcels)
    const { x, y } = center
    const estateName = estate.data.name || t('global.estate')

    return (
      <Card className="EstateCard">
        <Link to={locations.estateDetail(estate.asset_id)}>
          <div className="preview">
            <ParcelPreview
              x={x}
              y={y}
              zoom={zoom}
              debounce={debounce}
              size={12}
              selected={estate.data.parcels}
            />
          </div>
          <Card.Content className="body">
            <Card.Description title={estateName}>
              <span className="name">{estateName}</span>
            </Card.Description>

            <Card.Meta>
              {estate.last_transferred_at
                ? t('global.acquired_at', {
                    date: formatDate(
                      parseInt(estate.last_transferred_at, 10),
                      'MMMM Do, YYYY'
                    )
                  })
                : t('global.created_at', {
                    date: formatDate(
                      parseInt(estate.created_at, 10),
                      'MMMM Do, YYYY'
                    )
                  })}
            </Card.Meta>

            <div className="footer">
              <ParcelTags estate={estate} size="small" />
              <LandAmount value={estate.parcels.length} />
            </div>
          </Card.Content>
        </Link>
      </Card>
    )
  }
}
