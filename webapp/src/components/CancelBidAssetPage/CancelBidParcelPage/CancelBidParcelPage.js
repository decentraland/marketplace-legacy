import React from 'react'
import PropTypes from 'prop-types'
import { t, T } from '@dapps/modules/translation/utils'

import { splitCoordinate } from 'shared/coordinates'
import CancelListingAssetForm from 'components/CancelListingAssetForm'
import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import ParcelDetailLink from 'components/ParcelDetailLink'
import TxStatus from 'components/TxStatus'
import ParcelName from 'components/ParcelName'
import { bidType } from 'components/types'

export default class CancelBidParcelPage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    bid: bidType,
    isTxIdle: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  handleConfirm = () => {
    const { bid, onConfirm } = this.props
    onConfirm(bid)
  }

  renderSubtitle = parcel => {
    const { bid } = this.props
    const parcelDetailLink = <ParcelDetailLink parcel={parcel} />

    return bid ? (
      <T
        id="asset_cancel.about_to_cancel_bid"
        values={{ name: parcelDetailLink }}
      />
    ) : (
      <T
        id="asset_cancel.not_bid"
        values={{ asset_name: t('name.parcel'), asset: parcelDetailLink }}
      />
    )
  }

  render() {
    const { id, bid, isTxIdle, onCancel } = this.props
    const [x, y] = splitCoordinate(id)

    return (
      <Parcel x={x} y={y}>
        {parcel => (
          <div className="CancelSalePage">
            <ParcelModal
              x={x}
              y={y}
              title={t('asset_cancel.cancel_bid')}
              subtitle={this.renderSubtitle(parcel)}
              hasCustomFooter
            >
              <CancelListingAssetForm
                onCancel={onCancel}
                onConfirm={this.handleConfirm}
                isTxIdle={isTxIdle}
                isDisabled={!bid}
              />
              <TxStatus.Asset
                parcel={parcel}
                name={<ParcelName parcel={parcel} />}
              />
            </ParcelModal>
          </div>
        )}
      </Parcel>
    )
  }
}
