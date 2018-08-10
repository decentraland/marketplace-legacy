import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'semantic-ui-react'

import { assetType } from 'components/types'
import ParcelPreview from 'components/ParcelPreview'
import { isParcel } from 'shared/parcel'

import './AssetDetailPage.css'

export default class AssetDetailPage extends React.PureComponent {
  static propTypes = {
    asset: assetType.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    onError: PropTypes.func.isRequired,
    onAssetClick: PropTypes.func.isRequired,
    showMiniMap: PropTypes.bool,
    showControls: PropTypes.bool
  }

  static defaultProps = {
    showMiniMap: true,
    showControls: true
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      return this.props.onError(nextProps.error)
    }
  }

  render() {
    const {
      children,
      x,
      y,
      error,
      asset,
      onAssetClick,
      showMiniMap,
      showControls
    } = this.props

    if (error) {
      return null
    }
    return (
      <div className="AssetDetailPage">
        <div className="parcel-preview">
          <ParcelPreview
            x={x}
            y={y}
            selected={isParcel(asset) ? asset : asset.data.parcels}
            isDraggable
            showPopup
            showControls={showControls}
            showMinimap={showMiniMap}
            onClick={onAssetClick}
          />
        </div>
        <Container>{children}</Container>
      </div>
    )
  }
}
