import React from 'react'
import PropTypes from 'prop-types'

import { assetType, assetTypingType } from 'components/types'
import Asset from 'components/Asset'

export default class AssetLoader extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    asset: assetType,
    assetType: assetTypingType.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onAccessDenied: PropTypes.func.isRequired
  }

  static defaultProps = {
    asset: null
  }

  render() {
    const { asset } = this.props
    return <Asset asset={asset} {...this.props} />
  }
}
