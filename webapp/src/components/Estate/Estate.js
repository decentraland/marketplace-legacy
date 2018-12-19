import React from 'react'
import PropTypes from 'prop-types'

import AssetLoader from 'components/AssetLoader'
import { ASSET_TYPES } from 'shared/asset'

export default class Estate extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired
  }

  render() {
    const { id } = this.props
    return (
      <AssetLoader id={id} assetType={ASSET_TYPES.estate} {...this.props} />
    )
  }
}
