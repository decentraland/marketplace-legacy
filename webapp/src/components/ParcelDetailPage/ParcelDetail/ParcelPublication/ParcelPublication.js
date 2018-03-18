import React from 'react'
import PropTypes from 'prop-types'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import differenceInDays from 'date-fns/difference_in_days'

import { Grid, Button } from 'semantic-ui-react'
import { publicationType } from 'components/types'
import Mana from 'components/Mana'
import { t } from 'modules/translation/utils'

import './ParcelPublication.css'

const dateStyle = {
  fontSize: 20
}
const MAX_PUBLICATION_EXPIRES = 10 * 365

export default class ParcelName extends React.PureComponent {
  static propTypes = {
    publication: publicationType.isRequired,
    isOwner: PropTypes.bool,
    isConnected: PropTypes.bool,
    onBuy: PropTypes.func.isRequired
  }

  getExpiresDistance() {
    const { expires_at } = this.props.publication
    const difference = differenceInDays(expires_at, new Date())

    return !difference || difference >= MAX_PUBLICATION_EXPIRES
      ? t('parcel_detail.publication.more_than_years', {
          years: MAX_PUBLICATION_EXPIRES / 365
        })
      : distanceInWordsToNow(expires_at)
  }

  render() {
    const { publication, isOwner, onBuy, isConnected } = this.props

    return (
      <Grid.Row className="ParcelPublication">
        <Grid.Column width={4}>
          <h3>{t('parcel_detail.publication.price')}</h3>
          <Mana amount={parseFloat(publication.price, 10)} size={20} />
        </Grid.Column>
        <Grid.Column width={4}>
          <h3>{t('parcel_detail.publication.time_left')}</h3>
          <p style={dateStyle}>{this.getExpiresDistance()}</p>
        </Grid.Column>
        <Grid.Column textAlign="right" className="buy-column">
          {!isOwner ? (
            <Button primary onClick={onBuy}>
              {t('parcel_detail.publication.buy')}
            </Button>
          ) : null}
        </Grid.Column>
      </Grid.Row>
    )
  }
}
