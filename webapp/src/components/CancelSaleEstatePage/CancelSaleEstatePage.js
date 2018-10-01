import React from 'react'
import PropTypes from 'prop-types'

import Estate from 'components/Estate'
import EstateModal from 'components/EstateDetailPage/EditEstateMetadata/EstateModal'
import TxStatus from 'components/TxStatus'
import EstateName from 'components/EstateName'
import { t, T } from '@dapps/modules/translation/utils'
import CancelSaleAssetForm from 'components/CancelSaleAssetForm'
import { publicationType } from 'components/types'

export default class CancelSaleEstatePage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    publication: publicationType,
    isTxIdle: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  handleConfirm = () => {
    const { publication, onConfirm } = this.props
    onConfirm(publication)
  }

  renderSubtitle = estate => {
    const { publication } = this.props
    const estateDetailLink = <EstateName estate={estate} />

    return publication ? (
      <T
        id="asset_cancel.about_to_cancel"
        values={{ name: estateDetailLink }}
      />
    ) : (
      <T
        id="asset_cancel.not_for_sale"
        values={{ asset_name: t('name.estate'), asset: estateDetailLink }}
      />
    )
  }

  render() {
    const { id, publication, isTxIdle, onCancel } = this.props

    return (
      <Estate id={id} ownerOnly>
        {estate => (
          <div className="CancelSalePage">
            <EstateModal
              parcels={estate.data.parcels}
              title={t('asset_cancel.cancel_sale')}
              subtitle={this.renderSubtitle(estate)}
              hasCustomFooter
            >
              <CancelSaleAssetForm
                onCancel={onCancel}
                onConfirm={this.handleConfirm}
                isTxIdle={isTxIdle}
                isDisabled={!publication}
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
