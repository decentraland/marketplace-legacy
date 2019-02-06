import React from 'react'
import PropTypes from 'prop-types'
import { t, T } from '@dapps/modules/translation/utils'

import Estate from 'components/Estate'
import EstateModal from 'components/EditEstatePage/EditEstateMetadata/EstateModal'
import EstateName from 'components/EstateName'
import Mana from 'components/Mana'
import { walletType, bidType } from 'components/types'

export default class AcceptBidEstatePage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    wallet: walletType,
    bid: bidType,
    isLoading: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const { id, isTxIdle, onCancel, bid, handleConfirm } = this.props
    const { price } = bid
    return (
      <Estate id={id} onlyOwner>
        {estate => {
          return (
            <div className="BuyEstatePage">
              <EstateModal
                parcels={estate.data.parcels}
                title={t('asset_accept_bid.accept_bid_asset', {
                  asset_type: t('name.estate')
                })}
                subtitle={
                  <T
                    id="asset_accept_bid.about_to_accept_bid"
                    values={{
                      name: <EstateName estate={estate} />,
                      price: (
                        <React.Fragment>
                          {t('global.for')}&nbsp;&nbsp;
                          <Mana amount={price} size={14} />
                        </React.Fragment>
                      )
                    }}
                  />
                }
                onCancel={onCancel}
                onConfirm={handleConfirm}
                isDisabled={isTxIdle}
                isTxIdle={isTxIdle}
              />
            </div>
          )
        }}
      </Estate>
    )
  }
}
