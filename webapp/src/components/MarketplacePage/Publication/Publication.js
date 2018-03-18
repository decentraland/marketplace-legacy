import React from 'react'
import PropTypes from 'prop-types'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

import { locations } from 'locations'
import { Icon, Card } from 'semantic-ui-react'
import Mana from 'components/Mana'
import ParcelPreview from 'components/ParcelPreview'
import { publicationType } from 'components/types'
import { t } from 'modules/translation/utils'
import { formatDate, buildCoordinate } from 'lib/utils'

import './Publication.css'

export default class Publication extends React.PureComponent {
  static propTypes = {
    publication: publicationType,
    debounce: PropTypes.number
  }

  render() {
    const { publication, debounce } = this.props

    const isExpired = publication.expires_at < Date.now()
    const expirationTimeInWords = distanceInWordsToNow(publication.expires_at)

    return (
      <Card
        className="Publication"
        href={locations.parcelDetail(publication.x, publication.y)}
      >
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
            {isExpired
              ? t('publication.expired_at', { time: expirationTimeInWords })
              : t('publication.expires_in', { time: expirationTimeInWords })}
          </Card.Meta>
          <div className="coords">
            <Icon name="marker" size="small" />
            {buildCoordinate(publication.x, publication.y)}
          </div>
        </Card.Content>
      </Card>
    )
  }
}
