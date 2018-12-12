import React from 'react'
import PropTypes from 'prop-types'

import { parcelType, estateType } from 'components/types'
import Asset from 'components/Asset'

export default class AssetLoader extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    asset: PropTypes.oneOfType([parcelType, estateType]),
    assetType: PropTypes.string.isRequired,
    onAccessDenied: PropTypes.func.isRequired
  }

  static defaultProps = {
    asset: null
  }

  render() {
    const { asset } = this.props
    return <Asset value={asset} {...this.props} />
  }
}
