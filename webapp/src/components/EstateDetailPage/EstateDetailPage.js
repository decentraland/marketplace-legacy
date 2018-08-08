import React from 'react'
import PropTypes from 'prop-types'

import EstateDetail from './EstateDetail'
import Estate from 'components/Estate'
import { isNewAsset } from 'shared/asset'
import EditEstate from './EditEstate/EditEstate'
import { parcelType } from 'components/types'

export default class EstateDetailPage extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isEdition: props.isEdition,
      isSelecting: props.isSelecting
    }
  }

  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    assetId: PropTypes.string,
    isTxIdle: PropTypes.bool.isRequired,
    allParcels: PropTypes.objectOf(parcelType),
    submitEstate: PropTypes.func.isRequired,
    editEstateMetadata: PropTypes.func.isRequired,
    onViewAssetClick: PropTypes.func.isRequired,
    onDeleteEstate: PropTypes.func.isRequired,
    onEditParcels: PropTypes.func.isRequired,
    onEditMetadata: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const {
      assetId,
      x,
      y,
      isTxIdle,
      submitEstate,
      editEstateMetadata,
      onViewAssetClick,
      allParcels,
      onDeleteEstate,
      onEditParcels,
      onEditMetadata,
      onCancel
    } = this.props

    const { isEdition, isSelecting } = this.state
    return (
      <Estate assetId={assetId} x={x} y={y}>
        {(estate, isOwner, wallet) =>
          isNewAsset(estate) || isEdition ? (
            <EditEstate
              estate={estate}
              isCreation={isNewAsset(estate)}
              isOwner={isOwner}
              wallet={wallet}
              submitEstate={submitEstate}
              editEstateMetadata={editEstateMetadata}
              onViewAssetClick={onViewAssetClick}
              isSelecting={isNewAsset(estate) ? true : isSelecting}
              onCancel={onCancel}
            />
          ) : (
            <EstateDetail
              allParcels={allParcels}
              estate={estate}
              isOwner={isOwner}
              isTxIdle={isTxIdle}
              onViewAssetClick={onViewAssetClick}
              onDeleteEstate={onDeleteEstate}
              onEditParcels={onEditParcels}
              onEditMetadata={onEditMetadata}
            />
          )
        }
      </Estate>
    )
  }
}
