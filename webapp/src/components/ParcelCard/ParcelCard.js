import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Card } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { locations } from 'locations'
import Mana from 'components/Mana'
import ParcelCoord from 'components/ParcelCoords/ParcelCoord'
import ParcelTags from 'components/ParcelTags'
import ParcelPreview from 'components/ParcelPreview'
import Expiration from 'components/Expiration'
import { parcelType, publicationType } from 'components/types'
import { getOpenPublication } from 'modules/asset/utils'
import { isMortgageActive, getMortgageStatus } from 'shared/mortgage'
import { formatDate, distanceInWordsToNow } from 'lib/utils'
import './ParcelCard.css'

export default class ParcelCard extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    publications: PropTypes.objectOf(publicationType),
    debounce: PropTypes.number,
    showMortgage: PropTypes.bool,
    withMap: PropTypes.bool,
    withLink: PropTypes.bool
  }

  static defaultProps = {
    withMap: true,
    withLink: true
  }

  renderContent() {
    const { parcel, debounce, publications, showMortgage, withMap } = this.props

    const parcelName = this.props.parcel.data.name || 'Parcel'
    const publication = getOpenPublication(parcel, publications)
    const date = parseInt(
      parcel.last_transferred_at || parcel.auction_timestamp,
      10
    )

    return (
      <React.Fragment>
        {withMap && (
          <div className="preview">
            <ParcelPreview
              x={parcel.x}
              y={parcel.y}
              debounce={debounce}
              size={12}
              selected={parcel}
            />
          </div>
        )}
        <Card.Content className="body">
          <Card.Description title={parcelName}>
            <span className="name">{parcelName}</span>
            {publication ? (
              <Mana amount={parseFloat(publication.price)} />
            ) : null}
          </Card.Description>

          {publication && (
            <Card.Meta title={formatDate(parseInt(publication.expires_at, 10))}>
              <Expiration expiresAt={parseInt(publication.expires_at, 10)} />
            </Card.Meta>
          )}

          {!publication &&
            !showMortgage && (
              <Card.Meta title={formatDate(date, 'MMMM Do, YYYY')}>
                {t('global.acquired_ago', {
                  date: distanceInWordsToNow(date)
                })}
              </Card.Meta>
            )}

          {showMortgage &&
            isMortgageActive(parcel.mortgage, parcel) && (
              <p
                className={`mortgage-status ${getMortgageStatus(
                  parcel.mortgage
                )}`}
              >
                {getMortgageStatus(parcel.mortgage)}
              </p>
            )}
          <div className="extra">
            <ParcelCoord size="small" parcel={parcel} />
            <ParcelTags size="small" parcel={parcel} />
          </div>
        </Card.Content>
      </React.Fragment>
    )
  }

  render() {
    const { parcel, withLink } = this.props

    return (
      <Card className="ParcelCard">
        {withLink ? (
          <Link to={locations.parcelDetail(parcel.x, parcel.y)}>
            {this.renderContent()}
          </Link>
        ) : (
          this.renderContent()
        )}
      </Card>
    )
  }
}
