import React from 'react'
import PropTypes from 'prop-types'

import Estate from 'components/Estate'
import { parcelType, publicationType } from 'components/types'
import { isNewEstate } from 'shared/estate'
import EstateDetail from './EstateDetail'
import EditEstate from './EditEstate'

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
    id: PropTypes.string,
    publications: PropTypes.objectOf(publicationType).isRequired,
    allParcels: PropTypes.objectOf(parcelType),
    onViewAssetClick: PropTypes.func.isRequired,
    onEditParcels: PropTypes.func.isRequired,
    onEditMetadata: PropTypes.func.isRequired
  }

  render() {
    const {
      id,
      x,
      y,
      publications,
      onViewAssetClick,
      allParcels,
      onEditParcels,
      onEditMetadata
    } = this.props

    const { isEditing, isSelecting } = this.state
    return (
      <Estate id={id} x={x} y={y}>
        {(estate, isOwner, wallet) =>
          isNewEstate(estate) || isEditing ? (
            <EditEstate
              estate={estate}
              isCreation={isNewEstate(estate)}
              isOwner={isOwner}
              wallet={wallet}
              onViewAssetClick={onViewAssetClick}
              isSelecting={isNewEstate(estate) || isSelecting}
            />
          ) : (
            <EstateDetail
              estate={estate}
              publications={publications}
              allParcels={allParcels}
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
