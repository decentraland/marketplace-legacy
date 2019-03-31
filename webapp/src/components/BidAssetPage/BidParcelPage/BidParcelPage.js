import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Message } from 'semantic-ui-react'
import { t, T } from '@dapps/modules/translation/utils'

import { locations } from 'locations'
import { isActive } from 'shared/bid'
import { splitCoordinate } from 'shared/coordinates'
import BidAssetForm from '../BidAssetForm'
import { authorizationType, bidType, walletType } from 'components/types'
import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import TxStatus from 'components/TxStatus'
import ParcelName from 'components/ParcelName'
import ParcelDetailLink from 'components/ParcelDetailLink'

export default class BidParcelPage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    bid: bidType,
    authorization: authorizationType,
    isTxIdle: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onBid: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isAllowed: PropTypes.bool.isRequired,
    wallet: walletType
  }

  render() {
    const { id, bid, isTxIdle, onBid, onCancel, isAllowed, wallet } = this.props

    const [x, y] = splitCoordinate(id)
    const isBidActive = isActive(bid)

    return (
      <Parcel x={x} y={y} ownerNotAllowed>
        {parcel => (
          <div className="PublishPage">
            {!isAllowed ? (
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
                    isBidActive
                      ? 'asset_bid.update_asset'
                      : 'asset_bid.list_asset'
                  }
                  values={{ asset_name: t('name.parcel') }}
                />
              }
              subtitle={
                <T
                  id={
                    isBidActive
                      ? 'asset_bid.set_new_asset_price'
                      : 'asset_bid.set_asset_price'
                  }
                  values={{
                    asset_name: <ParcelDetailLink parcel={parcel} />
                  }}
                />
              }
              hasCustomFooter
            >
              <BidAssetForm
                asset={parcel}
                assetName={t('name.parcel')}
                bid={isBidActive ? bid : null}
                isTxIdle={isTxIdle}
                onBid={onBid}
                onCancel={onCancel}
                isDisabled={!isAllowed}
                balance={wallet.mana}
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
