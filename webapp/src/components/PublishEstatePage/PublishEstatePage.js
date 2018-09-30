import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Message } from 'semantic-ui-react'

import { locations } from 'locations'
import Estate from 'components/Estate'
import EstateModal from 'components/EstateDetailPage/EditEstateMetadata/EstateModal'
import EstateName from 'components/EstateName'
import TxStatus from 'components/TxStatus'
import { publicationType, walletType } from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import { isOpen } from 'shared/publication'
import { formatMana } from 'lib/utils'
import PublishAssetForm from '../PublishAssetForm'

export default class PublishEstatePage extends React.PureComponent {
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
      id,
      publication,
      isTxIdle,
      onPublish,
      onCancel
    } = this.props

    const { isLandAuthorized } = wallet

    return (
      <Estate id={id} ownerOnly>
        {estate => (
          <div className="PublishPage">
            {isOpen(publication) ? (
              <Container text>
                <Message
                  warning
                  icon="warning sign"
                  content={t('asset_publish.already_sold', {
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
                  content={
                    <T
                      id="asset_publish.please_authorize"
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
            <EstateModal
              parcels={estate.data.parcels}
              title={t('transfer_estate.transfer_estate')}
              subtitle={
                <T
                  id="transfer_estate.about_to_transfer"
                  values={{ name: estate.data.name }}
                />
              }
              hasCustomFooter
            >
              <PublishAssetForm
                asset={estate}
                isTxIdle={isTxIdle}
                onPublish={onPublish}
                onCancel={onCancel}
                isDisabled={!isLandAuthorized}
              />
              <TxStatus.Asset
                asset={estate}
                name={<EstateName estate={estate} />}
              />
            </EstateModal>
          </div>
        )}
      </Estate>
    )
  }
}
