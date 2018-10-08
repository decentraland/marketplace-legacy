import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Card } from 'semantic-ui-react'

import { locations } from 'locations'
import Mana from 'components/Mana'
import ParcelPreview from 'components/ParcelPreview'
import Expiration from 'components/Expiration'
import { parcelType, publicationType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import { isMortgageActive } from 'shared/mortgage'
import { AUCTION_DATE } from 'shared/parcel'
import { getOpenPublication } from 'shared/asset'

import { formatDate, distanceInWordsToNow } from 'lib/utils'
import { getMortgageStatus } from 'shared/mortgage'
import './ParcelCard.css'
import ParcelAttributes from 'components/ParcelAttributes'

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
            <React.Fragment>
              <Card.Meta
                title={formatDate(parseInt(publication.expires_at, 10))}
              >
                <Expiration expiresAt={parseInt(publication.expires_at, 10)} />
              </Card.Meta>
            </React.Fragment>
          )}

          {!publication &&
            !showMortgage && (
              <Card.Meta
                title={formatDate(
                  parcel.last_transferred_at
                    ? parseInt(parcel.last_transferred_at, 10)
                    : AUCTION_DATE,
                  'MMMM Do, YYYY'
                )}
              >
                {t('global.acquired_ago', {
                  date: distanceInWordsToNow(
                    parcel.last_transferred_at
                      ? parseInt(parcel.last_transferred_at, 10)
                      : AUCTION_DATE
                  )
                })}
              </Card.Meta>
            )}

          {showMortgage &&
            isMortgageActive(parcel.mortgage, parcel, publications) && (
              <React.Fragment>
                <p
                  className={`mortgage-status ${getMortgageStatus(
                    parcel.mortgage
                  )}`}
                >
                  {getMortgageStatus(parcel.mortgage)}
                </p>
              </React.Fragment>
            )}
          <ParcelAttributes parcel={parcel} />
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
