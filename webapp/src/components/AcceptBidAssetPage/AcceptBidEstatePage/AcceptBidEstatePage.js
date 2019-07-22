import React from 'react'
import PropTypes from 'prop-types'
import { t, T } from '@dapps/modules/translation/utils'

import Estate from 'components/Estate'
import EstateModal from 'components/EstateModal'
import EstateName from 'components/EstateName'
import Mana from 'components/Mana'
import { walletType, bidType } from 'components/types'

export default class AcceptBidEstatePage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    wallet: walletType,
    bid: bidType,
    isOpen: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired,
    bidderHasBalance: PropTypes.bool.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const {
      id,
      isTxIdle,
      onCancel,
      bid,
      handleConfirm,
      isOpen,
      bidderHasBalance
    } = this.props
    const { price } = bid
    return (
      <Estate id={id} shouldBeOwner>
        {estate => {
          return (
            <div className="AcceptBidEstatePage">
              <EstateModal
                parcels={estate.data.parcels}
                title={t('asset_accept_bid.accept_bid_asset', {
                  asset_type: t('name.estate')
                })}
                subtitle={
                  !isOpen ? (
                    t('asset_accept_bid.expired')
                  ) : (
                    <T
                      id="asset_accept_bid.about_to_accept_bid"
                      values={{
                        name: <EstateName estate={estate} />,
                        price: <Mana amount={Math.floor(price)} size={14} />
                      }}
                    />
                  )
                }
                onCancel={onCancel}
                onConfirm={handleConfirm}
                isDisabled={isTxIdle || !isOpen || !bidderHasBalance}
                isTxIdle={isTxIdle}
              />
            </div>
          )
        }}
      </Estate>
    )
  }
}
