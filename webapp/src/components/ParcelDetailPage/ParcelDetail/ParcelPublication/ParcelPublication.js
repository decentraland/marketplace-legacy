import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Button } from 'semantic-ui-react'
import { publicationType } from 'components/types'
import Mana from 'components/Mana'
import PublicationExpiration from 'components/PublicationExpiration'
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
    const { publication, isOwner, onBuy } = this.props

    return (
      <Grid.Row className="ParcelPublication">
        <Grid.Column width={4}>
          <h3>{t('parcel_detail.publication.price')}</h3>
          <Mana amount={parseFloat(publication.price, 10)} size={20} />
        </Grid.Column>
        <Grid.Column width={4}>
          <h3>{t('parcel_detail.publication.time_left')}</h3>
          <PublicationExpiration publication={publication} />
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
