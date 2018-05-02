import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { Icon, Card } from 'semantic-ui-react'
import Mana from 'components/Mana'
import ParcelPreview from 'components/ParcelPreview'
import PublicationExpiration from 'components/PublicationExpiration'
import ParcelTags from 'components/ParcelTags'
import { parcelType } from 'components/types'
import { AUCTION_DATE } from 'lib/parcelUtils'
import { isOpen } from 'modules/publication/utils'
import { t } from 'modules/translation/utils'
import { formatDate, buildCoordinate } from 'lib/utils'

import './ParcelCard.css'

export default class ParcelCard extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    debounce: PropTypes.number
  }

  render() {
    const { parcel, debounce } = this.props
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
            {isOpen(publication) ? (
              <React.Fragment>
                <Card.Meta title={formatDate(publication.expires_at)}>
                  <PublicationExpiration publication={publication} />
                </Card.Meta>
                <div className="mana">
                  <Mana amount={parseFloat(publication.price, 10)} />
                </div>
              </React.Fragment>
            ) : (
              <Card.Meta>
                {t('publication.acquired_at', {
                  date: formatDate(
                    parcel.last_transfered_at || AUCTION_DATE,
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
