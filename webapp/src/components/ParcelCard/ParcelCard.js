import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { Icon, Card } from 'semantic-ui-react'
import Mana from 'components/Mana'
import ParcelPreview from 'components/ParcelPreview'
import Expiration from 'components/Expiration'
import ParcelTags from 'components/ParcelTags'
import { parcelType } from 'components/types'
import { AUCTION_DATE } from 'lib/parcelUtils'
import { PUBLICATION_STATUS } from 'modules/publication/utils'
import { MORTGAGE_STATUS } from 'modules/mortgage/utils'
import { t } from 'modules/translation/utils'
import { formatDate, buildCoordinate, isOpen } from 'lib/utils'

import './ParcelCard.css'

export default class ParcelCard extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    debounce: PropTypes.number,
    showMortgage: PropTypes.bool
  }

  render() {
    const { parcel, debounce, showMortgage } = this.props
    const { x, y, publication } = parcel

    const parcelName = this.props.parcel.data.name || 'Parcel'
    const isPublicationOpen = isOpen(publication, PUBLICATION_STATUS.open)

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
              {isPublicationOpen ? (
                <Mana amount={parseFloat(publication.price)} />
              ) : null}
            </Card.Description>

            {isPublicationOpen && (
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

            {isPublicationOpen &&
              !showMortgage && (
                <Card.Meta>
                  {t('global.acquired_at', {
                    date: formatDate(
                      parcel.last_transferred_at
                        ? parseInt(parcel.last_transferred_at, 10)
                        : AUCTION_DATE,
                      'MMM Do, YYYY'
                    )
                  })}
                </Card.Meta>
              )}

            {showMortgage &&
              isOpen(parcel.mortgage, MORTGAGE_STATUS.open) && (
                <React.Fragment>
                  <p className={`mortgage-status ${parcel.mortgage.status}`}>
                    {parcel.mortgage.status}
                  </p>
                </React.Fragment>
              )}
            {!isOpen(publication, PUBLICATION_STATUS.open) &&
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
