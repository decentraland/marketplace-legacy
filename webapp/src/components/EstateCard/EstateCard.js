import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Card } from 'semantic-ui-react'

import { locations } from 'locations'
import ParcelPreview from 'components/ParcelPreview'
import ParcelTags from 'components/ParcelTags'
import LandAmount from 'components/LandAmount'
import Expiration from 'components/Expiration'
import Mana from 'components/Mana'
import { estateType, publicationType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import { calculateMapProps } from 'shared/estate'
import { formatDate, distanceInWordsToNow } from 'lib/utils'
import { getOpenPublication } from 'shared/asset'

import './EstateCard.css'

export default class EstateCard extends React.PureComponent {
  static propTypes = {
    estate: estateType,
    debounce: PropTypes.number,
    publications: PropTypes.objectOf(publicationType)
  }

  render() {
    const { estate, debounce, publications } = this.props
    const size = 12
    const { center, zoom, pan } = calculateMapProps(estate.data.parcels, size)
    const { x, y } = center
    const estateName = estate.data.name || t('global.estate')
    const publication = getOpenPublication(estate, publications)

    return (
      <Card className="EstateCard">
        <Link to={locations.estateDetail(estate.id)}>
          <div className="preview">
            <ParcelPreview
              x={x}
              y={y}
              zoom={zoom}
              debounce={debounce}
              size={size}
              panX={pan.x}
              panY={pan.y}
              selected={estate.data.parcels}
            />
          </div>
          <Card.Content className="body">
            <Card.Description title={estateName}>
              <span className="name">{estateName}</span>
              {publication && <Mana amount={parseFloat(publication.price)} />}
            </Card.Description>

            {publication && (
              <React.Fragment>
                <Card.Meta
                  title={formatDate(parseInt(publication.expires_at, 10))}
                >
                  <Expiration
                    expiresAt={parseInt(publication.expires_at, 10)}
                  />
                </Card.Meta>
              </React.Fragment>
            )}

            {!publication && (
              <Card.Meta
                title={formatDate(
                  parseInt(estate.last_transferred_at || estate.created_at, 10),
                  'MMMM Do, YYYY'
                )}
              >
                {estate.last_transferred_at
                  ? t('global.acquired_ago', {
                      date: distanceInWordsToNow(
                        parseInt(estate.last_transferred_at, 10)
                      )
                    })
                  : t('global.created_at', {
                      date: distanceInWordsToNow(
                        parseInt(estate.created_at, 10)
                      )
                    })}
              </Card.Meta>
            )}

            <div className="footer">
              <ParcelTags estate={estate} size="small" />
              <LandAmount value={estate.parcels ? estate.parcels.length : 0} />
            </div>
          </Card.Content>
        </Link>
      </Card>
    )
  }
}
