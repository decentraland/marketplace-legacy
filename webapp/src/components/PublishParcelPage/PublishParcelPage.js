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
import PublishAssetForm from 'components/PublishAssetForm'

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

    return (
      <Parcel x={x} y={y} ownerOnly>
        {parcel => {
          const isMarketplaceApproved =
            authorization && authorization.approvals.Marketplace.LANDRegistry
          const isOnSale = isOpen(publication)
          return (
            <div className="PublishPage">
              {!isMarketplaceApproved ? (
                <Container text>
                  <Message
                    warning
                    icon="warning sign"
                    header={t('global.unauthorized')}
                    content={
                      <T
                        id="asset_publish.please_authorize"
                        values={{
                          settings_link: (
                            <Link to={locations.settings()}>Settings</Link>
                          ),
                          asset_name: t('name.parcel')
                        }}
                      />
                    }
                  />
                </Container>
              ) : null}
              <ParcelModal
                x={x}
                y={y}
                title={
                  <T
                    id={
                      isOnSale
                        ? 'asset_publish.update_asset'
                        : 'asset_publish.list_asset'
                    }
                    values={{ asset_name: t('name.parcel') }}
                  />
                }
                subtitle={
                  <T
                    id={
                      isOnSale
                        ? 'asset_publish.set_new_asset_price'
                        : 'asset_publish.set_asset_price'
                    }
                    values={{
                      asset_name: <ParcelDetailLink parcel={parcel} />
                    }}
                  />
                }
                hasCustomFooter
              >
                <PublishAssetForm
                  asset={parcel}
                  assetName={t('name.parcel')}
                  publication={isOnSale ? publication : null}
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
          )
        }}
      </Parcel>
    )
  }
}
