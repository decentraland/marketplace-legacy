import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Message, Loader } from 'semantic-ui-react'
import { t, T } from '@dapps/modules/translation/utils'

import { locations } from 'locations'
import { isOpen } from 'shared/listing'
import BidAssetForm from '../BidAssetForm'
import { authorizationType, bidType } from 'components/types'
import Estate from 'components/Estate'
import EstateName from 'components/EstateName'
import TxStatus from 'components/TxStatus'
import EstateModal from 'components/EditEstatePage/EditEstateMetadata/EstateModal'

export default class BidEstatePage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    bid: bidType,
    authorization: authorizationType,
    isLoading: PropTypes.bool.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onBid: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  renderLoading() {
    return (
      <div>
        <Loader active size="massive" />
      </div>
    )
  }

  isAllowed = () =>
    this.props.authorization &&
    this.props.authorization.allowances.ERC721Bid.MANAToken

  render() {
    const { id, bid, isLoading, isTxIdle, onBid, onCancel } = this.props

    const bidIsOpen = isOpen(bid)

    if (isLoading) {
      return this.renderLoading()
    }

    return (
      <Estate id={id} ownerNotAllowed>
        {estate => (
          <div className="PublishPage">
            {!this.isAllowed() ? (
              <Container text>
                <Message
                  warning
                  icon="warning sign"
                  header={t('global.unauthorized')}
                  content={
                    <T
                      id="asset_bid.please_authorize"
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
                    bidIsOpen
                      ? 'asset_bid.update_asset'
                      : 'asset_bid.list_asset'
                  }
                  values={{ asset_name: t('name.estate') }}
                />
              }
              subtitle={
                <T
                  id={
                    bidIsOpen
                      ? 'asset_bid.set_new_asset_price'
                      : 'asset_bid.set_asset_price'
                  }
                  values={{ asset_name: estate.data.name }}
                />
              }
              hasCustomFooter
            >
              <BidAssetForm
                asset={estate}
                assetName={t('name.estate')}
                bid={bidIsOpen ? bid : null}
                isTxIdle={isTxIdle}
                onBid={onBid}
                onCancel={onCancel}
                isDisabled={!this.isAllowed()}
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
