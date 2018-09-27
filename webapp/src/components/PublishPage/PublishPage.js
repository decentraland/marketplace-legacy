import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Loader, Container, Message } from 'semantic-ui-react'

import { locations } from 'locations'
import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import TxStatus from 'components/TxStatus'
import ParcelName from 'components/ParcelName'
import ParcelDetailLink from 'components/ParcelDetailLink'
import { publicationType, authorizationType } from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import { isOpen } from 'shared/publication'
import { formatMana } from 'lib/utils'
import PublicationForm from './PublicationForm'

import './PublishPage.css'

export default class PublishPage extends React.PureComponent {
  static propTypes = {
    publication: publicationType,
    authorization: authorizationType,
    isTxIdle: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onPublish: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  renderLoading() {
    return (
      <div>
        <Loader active size="massive" />
      </div>
    )
  }

  render() {
    const {
      x,
      y,
      authorization,
      publication,
      isTxIdle,
      isLoading,
      onPublish,
      onCancel
    } = this.props

    if (isLoading) {
      return this.renderLoading()
    }

    const { approvals } = authorization
    const isMarketplaceApproved = approvals.Marketplace.LANDRegistry

    return (
      <Parcel x={x} y={y} ownerOnly>
        {parcel => (
          <div className="PublishPage">
            {isOpen(publication) ? (
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
            {!isMarketplaceApproved ? (
              <Container text>
                <Message
                  warning
                  icon="warning sign"
                  header={t('global.unauthorized')}
                  content={
                    <T
                      id="parcel_publish.please_authorize"
                      values={{
                        settings_link: (
                          <Link to={locations.settings()}>Settings</Link>
                        )
                      }}
                    />
                  }
                />
              </Container>
            ) : null}
            <ParcelModal
              x={x}
              y={y}
              title={t('parcel_publish.list_land')}
              subtitle={
                <T
                  id="parcel_publish.set_land_price"
                  values={{ parcel_name: <ParcelDetailLink parcel={parcel} /> }}
                />
              }
              hasCustomFooter
            >
              <PublicationForm
                parcel={parcel}
                isTxIdle={isTxIdle}
                onPublish={onPublish}
                onCancel={onCancel}
                isDisabled={!isMarketplaceApproved}
              />
              <TxStatus.Asset
                asset={parcel}
                name={<ParcelName parcel={parcel} />}
              />
            </ParcelModal>
          </div>
        )}
      </Parcel>
    )
  }
}
