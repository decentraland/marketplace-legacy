import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { Icon, Card } from 'semantic-ui-react'
import Mana from 'components/Mana'
import ParcelPreview from 'components/ParcelPreview'
import Expiration from 'components/Expiration'
import ParcelTags from 'components/ParcelTags'
import { parcelType, publicationType } from 'components/types'
import { isMortgageActive } from 'shared/mortgage'
import { t } from 'modules/translation/utils'
import {
  AUCTION_DATE,
  buildCoordinate,
  getOpenPublication
} from 'shared/parcel'

import { formatDate } from 'lib/utils'

import './ParcelCard.css'

export default class ParcelCard extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    publications: PropTypes.objectOf(publicationType),
    debounce: PropTypes.number,
    showMortgage: PropTypes.bool
  }

  render() {
    const { parcel, debounce, publications, showMortgage } = this.props
    const { x, y } = parcel

    const parcelName = this.props.parcel.data.name || 'Parcel'
    const publication = getOpenPublication(parcel, publications)

    return (
      <Card className="ParcelCard">
        <Link to={locations.parcelDetail(x, y)}>
          <div className="preview">
            <ParcelPreview
              x={x}
              y={y}
              debounce={debounce}
              size={12}
              selected={parcel}
            />
          </div>
          <Card.Content className="body">
            <Card.Description title={parcelName}>
              <span className="name">{parcelName}</span>
              {publication ? (
                <Mana amount={parseFloat(publication.price)} />
              ) : null}
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

            {!publication &&
              !showMortgage && (
                <Card.Meta>
                  {t('global.acquired_at', {
                    date: formatDate(
                      parcel.last_transferred_at
                        ? parseInt(parcel.last_transferred_at, 10)
                        : AUCTION_DATE,
                      'MMMM Do, YYYY'
                    )
                  })}
                </Card.Meta>
              )}

            {showMortgage &&
              isMortgageActive(parcel.mortgage, parcel) && (
                <React.Fragment>
                  <p className={`mortgage-status ${parcel.mortgage.status}`}>
                    {parcel.mortgage.status}
                  </p>
                </React.Fragment>
              )}
            <div className="footer">
              <div className="coords">
                <Icon name="marker" />
                <span className="coord">{buildCoordinate(x, y)}</span>
              </div>
              <ParcelTags parcel={parcel} size="small" />
            </div>
          </Card.Content>
        </Link>
      </Card>
    )
  }
}
