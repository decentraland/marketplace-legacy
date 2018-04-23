import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { Icon, Card } from 'semantic-ui-react'
import Mana from 'components/Mana'
import ParcelPreview from 'components/ParcelPreview'
import PublicationExpiration from 'components/PublicationExpiration'
import { publicationType } from 'components/types'
import { formatDate, buildCoordinate } from 'lib/utils'

import './ParcelCard.css'

export default class ParcelCard extends React.PureComponent {
  static propTypes = {
    publication: publicationType,
    debounce: PropTypes.number
  }

  render() {
    const { publication, debounce } = this.props

    /*
    parcel: {
      x
      y
      name
      tags
      publication: {
        price
        expires_at
      }
    }
    */

    return (
      <Card className="ParcelCard">
        <Link to={locations.parcelDetail(publication.x, publication.y)}>
          <div className="preview">
            <ParcelPreview
              x={publication.x}
              y={publication.y}
              debounce={debounce}
              size={12}
            />
          </div>
          <Card.Content className="body">
            <Mana amount={parseFloat(publication.price, 10)} />
            <Card.Meta title={formatDate(publication.expires_at)}>
              <PublicationExpiration publication={publication} />
            </Card.Meta>
            <div className="coords">
              <Icon name="marker" size="small" />
              {buildCoordinate(publication.x, publication.y)}
            </div>
          </Card.Content>
        </Link>
      </Card>
    )
  }
}
