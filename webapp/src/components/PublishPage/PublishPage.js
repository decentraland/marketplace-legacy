import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { txUtils } from 'decentraland-commons'

import { locations } from 'locations'
import { Container, Header, Grid, Message } from 'semantic-ui-react'
import PublicationForm from './PublicationForm'
import ParcelName from 'components/ParcelName'
import Parcel from 'components/Parcel'
import TxStatus from 'components/TxStatus'

import { publicationType, walletType } from 'components/types'
import { t, t_html } from 'modules/translation/utils'

import { formatMana } from 'lib/utils'

import './PublishPage.css'

export default class PublishPage extends React.PureComponent {
  static propTypes = {
    publication: publicationType,
    wallet: walletType,
    isTxIdle: PropTypes.bool.isRequired,
    onPublish: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const {
      wallet,
      x,
      y,
      publication,
      isTxIdle,
      onPublish,
      onCancel
    } = this.props

    const { isLandAuthorized } = wallet

    const isAlreadyOnSale =
      publication &&
      publication.tx_status === txUtils.TRANSACTION_STATUS.confirmed

    return (
      <Parcel x={x} y={y} ownerOnly>
        {parcel => (
          <div className="PublishPage">
            {isAlreadyOnSale ? (
              <Container text>
                <Message
                  warning
                  icon="warning sign"
                  content={t('parcel_publish.already_sold', {
                    value: formatMana(publication.price)
                  })}
                />
              </Container>
            ) : null}
            {!isLandAuthorized ? (
              <Container text>
                <Message
                  warning
                  icon="warning sign"
                  header={t('global.unauthorized')}
                  content={t_html('parcel_publish.please_authorize', {
                    settings_link: <Link to={locations.settings}>Settings</Link>
                  })}
                />
              </Container>
            ) : null}
            <Container text textAlign="center">
              <Header as="h2" size="huge" className="title">
                {t('parcel_publish.list_land')}
              </Header>
              <span className="subtitle">
                {t_html('parcel_publish.set_land_price', {
                  parcel_name: <ParcelName parcel={parcel} />
                })}
              </span>
            </Container>
            <br />
            <Container text>
              <Grid.Column>
                <PublicationForm
                  parcel={parcel}
                  publication={publication}
                  isTxIdle={isTxIdle}
                  onPublish={onPublish}
                  onCancel={onCancel}
                  isDisabled={!isLandAuthorized}
                />
                <TxStatus.Parcel parcel={parcel} />
              </Grid.Column>
            </Container>
          </div>
        )}
      </Parcel>
    )
  }
}
