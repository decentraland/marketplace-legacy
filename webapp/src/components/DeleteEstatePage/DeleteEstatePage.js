import React from 'react'
import PropTypes from 'prop-types'

import EstateModal from 'components/EstateDetailPage/EditEstateMetadata/EstateModal'
import Estate from 'components/Estate'
import { isNewAsset } from 'shared/asset'
import { t } from 'modules/translation/utils'

export default class DeleteEstatePage extends React.PureComponent {
  static props = {
    assetId: PropTypes.string.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
  }
  render() {
    const { assetId, isTxIdle, onCancel, onConfirm } = this.props
    return (
      <Estate assetId={assetId} ownerOnly>
        {estate => (
          <React.Fragment>
            <EstateModal
              estate={estate}
              parcels={estate.data.parcels}
              title={t('estate_detail.dissolve')}
              subtitle={t('estate_detail.dissolve_desc', {
                name: estate.data.name
              })}
              isTxIdle={isTxIdle}
              onCancel={onCancel}
              onConfirm={onConfirm}
              isDisabled={isNewAsset(estate)}
            />
          </React.Fragment>
        )}
      </Estate>
    )
  }
}
