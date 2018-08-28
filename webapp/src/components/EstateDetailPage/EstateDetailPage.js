import React from 'react'
import PropTypes from 'prop-types'

import EstateDetail from './EstateDetail'
import Estate from 'components/Estate'
import { isNewAsset } from 'shared/asset'
import EditEstate from './EditEstate'
import { parcelType } from 'components/types'

export default class EstateDetailPage extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isEditing: props.isEditing,
      isSelecting: props.isSelecting
    }
  }

  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    assetId: PropTypes.string,
    allParcels: PropTypes.objectOf(parcelType),
    onViewAssetClick: PropTypes.func.isRequired,
    onEditParcels: PropTypes.func.isRequired,
    onEditMetadata: PropTypes.func.isRequired
  }

  render() {
    const {
      assetId,
      x,
      y,
      onViewAssetClick,
      allParcels,
      onEditParcels,
      onEditMetadata
    } = this.props

    const { isEditing, isSelecting } = this.state
    return (
      <Estate assetId={assetId} x={x} y={y}>
        {(estate, isOwner, wallet) =>
          estate.data.parcels.length > 0 &&
          (isNewAsset(estate) || isEditing) ? (
            <EditEstate
              estate={estate}
              isCreation={isNewAsset(estate)}
              isOwner={isOwner}
              wallet={wallet}
              onViewAssetClick={onViewAssetClick}
              isSelecting={isNewAsset(estate) || isSelecting}
            />
          ) : (
            <EstateDetail
              allParcels={allParcels}
              estate={estate}
              isOwner={isOwner}
              onViewAssetClick={onViewAssetClick}
              onEditParcels={onEditParcels}
              onEditMetadata={onEditMetadata}
            />
          )
        }
      </Estate>
    )
  }
}
