import React from 'react'
import PropTypes from 'prop-types'
import { t, T } from '@dapps/modules/translation/utils'

import CancelListingAssetForm from 'components/CancelListingAssetForm'
import Estate from 'components/Estate'
import EstateModal from 'components/EditEstatePage/EditEstateMetadata/EstateModal'
import TxStatus from 'components/TxStatus'
import EstateName from 'components/EstateName'
import { bidType } from 'components/types'

export default class CancelBidEstatePage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    bid: bidType,
    isTxIdle: PropTypes.bool.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  renderSubtitle = estate => {
    const { bid } = this.props
    const estateDetailLink = <EstateName estate={estate} />

    return bid ? (
      <T
        id="asset_cancel.about_to_cancel_bid"
        values={{ name: estateDetailLink }}
      />
    ) : (
      <T
        id="asset_cancel.not_bid"
        values={{ asset_name: t('name.estate'), asset: estateDetailLink }}
      />
    )
  }

  render() {
    const { id, bid, isTxIdle, onCancel, handleConfirm } = this.props

    return (
      <Estate id={id}>
        {estate => (
          <div className="CancelSalePage">
            <EstateModal
              parcels={estate.data.parcels}
              title={t('asset_cancel.cancel_bid')}
              subtitle={this.renderSubtitle(estate)}
              hasCustomFooter
            >
              <CancelListingAssetForm
                onCancel={onCancel}
                onConfirm={handleConfirm}
                isTxIdle={isTxIdle}
                isDisabled={!bid}
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
