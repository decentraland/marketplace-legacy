import React from 'react'
import PropTypes from 'prop-types'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { Grid, Button } from 'semantic-ui-react'
import { publicationType } from 'components/types'
import { formatMana } from 'lib/utils'
import { t } from 'modules/translation/utils'

import './ParcelPublication.css'

export default class ParcelName extends React.PureComponent {
  static propTypes = {
    publication: publicationType.isRequired,
    isOwner: PropTypes.bool,
    isConnected: PropTypes.bool,
    onBuy: PropTypes.func.isRequired
  }

  render() {
    const { publication, isOwner, onBuy, isConnected } = this.props
    return (
      <Grid.Row>
        <Grid.Column width={4}>
          <h3>{t('parcel_detail.publication.price')}</h3>
          <p>{formatMana(publication.price)}</p>
        </Grid.Column>
        <Grid.Column width={4}>
          <h3>{t('parcel_detail.publication.time_left')}</h3>
          <p>{distanceInWordsToNow(publication.expires_at)}</p>
        </Grid.Column>
        <Grid.Column width={2} textAlign="right">
          {!isOwner && isConnected ? (
            <Button primary onClick={onBuy}>
              {t('parcel_detail.publication.buy')}
            </Button>
          ) : null}
        </Grid.Column>
      </Grid.Row>
    )
  }
}
