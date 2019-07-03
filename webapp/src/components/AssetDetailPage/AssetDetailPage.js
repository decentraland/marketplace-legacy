import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'

import AssetLoader from 'components/AssetLoader'
import ParcelDetailPage from 'components/ParcelDetailPage'
import EstateDetailPage from 'components/EstateDetailPage'
import AssetPreviewHeader from 'components/AssetPreviewHeader'
import { ASSET_TYPES } from 'shared/asset'
import './AssetDetailPage.css'

export default class AssetDetailPage extends React.PureComponent {
  static propTypes = {
    assetType: PropTypes.string.isRequired,
    onAssetClick: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      isLoadingNextAsset: false
    }
  }

  componentWillReceiveProps() {
    this.setState({ isLoadingNextAsset: false })
  }

  handleAssetClick = ({ id, assetType }) => {
    this.setState({ isLoadingNextAsset: true })
    this.props.onAssetClick(id, assetType)
  }

  hasPreviewHeader(asset, assetType) {
    // Here we can decide wether to have a preview header or not
    // depending on the asset or the assetType (for future types of assets)
    switch (assetType) {
      case ASSET_TYPES.parcel:
        return asset != null
      case ASSET_TYPES.estate:
        return asset != null && asset.data.parcels.length > 0
      default:
        return false
    }
  }

  renderLoading() {
    return (
      <div className="asset-detail-loading">
        <Loader active size="massive" />
      </div>
    )
  }

  renderDetailPage(asset, attributes) {
    if (!asset || this.state.isLoadingNextAsset) {
      return this.renderLoading()
    }

    const { assetType } = this.props

    if (ASSET_TYPES[assetType] == null) {
      const assetTypesStr = Object.values(ASSET_TYPES).join(', ')
      throw new Error(
        `[AssetDetailPage] You must provide one of the following asset types: [${assetTypesStr}] but received "${assetType}" instead`
      )
    }

    let DetailPage
    switch (assetType) {
      case ASSET_TYPES.parcel:
        DetailPage = ParcelDetailPage
        break
      case ASSET_TYPES.estate:
        DetailPage = EstateDetailPage
        break
    }
    return <DetailPage asset={asset} {...attributes} />
  }

  render() {
    const { id, assetType } = this.props
    return (
      <AssetLoader id={id} assetType={assetType}>
        {(asset, attributes) =>
          this.hasPreviewHeader(asset, assetType) ? (
            <AssetPreviewHeader
              asset={asset}
              onAssetClick={this.handleAssetClick}
            >
              {this.renderDetailPage(asset, attributes)}
            </AssetPreviewHeader>
          ) : (
            this.renderDetailPage(asset, attributes)
          )
        }
      </AssetLoader>
    )
  }
}
