import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Message, Loader } from 'semantic-ui-react'

import { locations } from 'locations'
import Estate from 'components/Estate'
import EstateModal from 'components/EditEstatePage/EditEstateMetadata/EstateModal'
import EstateName from 'components/EstateName'
import TxStatus from 'components/TxStatus'
import { publicationType, authorizationType } from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import { isOpen } from 'shared/publication'
import { formatMana } from 'lib/utils'
import PublishAssetForm from '../PublishAssetForm'

export default class PublishEstatePage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    authorization: authorizationType,
    isLoading: PropTypes.bool.isRequired,
    publication: publicationType,
    isTxIdle: PropTypes.bool.isRequired,
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
      id,
      publication,
      isLoading,
      authorization,
      isTxIdle,
      onPublish,
      onCancel
    } = this.props

    if (isLoading) {
      return this.renderLoading()
    }

    return (
      <Estate id={id} ownerOnly>
        {estate => {
          const { approvals } = authorization
          const isMarketplaceApproved = approvals.Marketplace.EstateRegistry
          const isOnSale = isOpen(publication)
          return (
            <div className="PublishPage">
              {isOnSale ? (
                <Container text>
                  <Message
                    warning
                    icon="warning sign"
                    content={t('asset_publish.already_sold', {
                      value: formatMana(publication.price),
                      asset_name: t('name.estate')
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
                        id="asset_publish.please_authorize"
                        values={{
                          settings_link: (
                            <Link to={locations.settings()}>Settings</Link>
                          ),
                          asset_name: t('name.estate')
                        }}
                      />
                    }
                  />
                </Container>
              ) : null}
              <EstateModal
                parcels={estate.data.parcels}
                title={
                  <T
                    id={
                      isOnSale
                        ? 'asset_publish.update_asset'
                        : 'asset_publish.list_asset'
                    }
                    values={{ asset_name: t('name.estate') }}
                  />
                }
                subtitle={
                  <T
                    id={
                      isOnSale
                        ? 'asset_publish.set_new_asset_price'
                        : 'asset_publish.set_asset_price'
                    }
                    values={{ asset_name: estate.data.name }}
                  />
                }
                hasCustomFooter
              >
                <PublishAssetForm
                  asset={estate}
                  assetName={t('name.estate')}
                  isTxIdle={isTxIdle}
                  onPublish={onPublish}
                  onCancel={onCancel}
                  isDisabled={!isMarketplaceApproved}
                />
                <TxStatus.Asset
                  asset={estate}
                  name={<EstateName estate={estate} />}
                />
              </EstateModal>
            </div>
          )
        }}
      </Estate>
    )
  }
}
