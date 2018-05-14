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
import { isOpen } from 'modules/publication/utils'
import { isOpen as isMortgageOpen } from 'modules/mortgage/utils'
import { t } from 'modules/translation/utils'
import { formatDate, buildCoordinate } from 'lib/utils'

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

    return (
      <Card className="ParcelCard">
        <Link to={locations.parcelDetail(x, y)}>
          <div className="preview">
            <ParcelPreview x={x} y={y} debounce={debounce} size={12} />
          </div>
          <Card.Content className="body">
            <Card.Description title={parcelName}>{parcelName}</Card.Description>
            {isOpen(publication) && (
              <React.Fragment>
                <Card.Meta
                  title={formatDate(parseInt(publication.expires_at, 10))}
                >
                  <Expiration expiresAt={parseInt(publication.expires_at, 10)} />
                </Card.Meta>
                <div className="mana">
                  <Mana amount={parseFloat(publication.price, 10)} />
                </div>
              </React.Fragment>
            )}
            {showMortgage &&
              isMortgageOpen(parcel.mortgages[0]) && (
                /* TODO: Revisit when states are defined */
                <React.Fragment>
                  <p
                    className={`mortgage-status ${parcel.mortgages[0].status}`}
                  >
                    {parcel.mortgages[0].status}
                  </p>
                </React.Fragment>
              )}
            {!isOpen(publication) &&
              !showMortgage && (
                <Card.Meta>
                  {t('publication.acquired_at', {
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
              {parcel.tags ? <ParcelTags parcel={parcel} size="small" /> : null}
            </div>
          </Card.Content>
        </Link>
      </Card>
    )
  }
}
