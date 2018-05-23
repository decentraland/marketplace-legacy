import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { Container, Message } from 'semantic-ui-react'
import PublicationForm from './PublicationForm'
import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import TxStatus from 'components/TxStatus'

import { publicationType, walletType } from 'components/types'
import { PUBLICATION_STATUS } from 'modules/publication/utils'
import { t, t_html } from 'modules/translation/utils'

import { formatMana, buildCoordinate, isOpen } from 'lib/utils'

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

    return (
      <Parcel x={x} y={y} ownerOnly>
        {parcel => (
          <div className="PublishPage">
            {isOpen(publication, PUBLICATION_STATUS.open) ? (
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
            <ParcelModal
              x={x}
              y={y}
              title={t('parcel_publish.list_land')}
              subtitle={t_html('parcel_publish.set_land_price', {
                parcel_name: (
                  <Link to={locations.parcelDetail(x, y)}>
                    {buildCoordinate(x, y)}
                  </Link>
                )
              })}
              hasCustomFooter
            >
              <PublicationForm
                parcel={parcel}
                publication={publication}
                isTxIdle={isTxIdle}
                onPublish={onPublish}
                onCancel={onCancel}
                isDisabled={!isLandAuthorized}
              />
              <TxStatus.Parcel parcel={parcel} />
            </ParcelModal>
          </div>
        )}
      </Parcel>
    )
  }
}
