import React from 'react'
import PropTypes from 'prop-types'

import AssetLoader from 'components/AssetLoader'
import { ASSET_TYPES } from 'shared/asset'
import { buildCoordinate } from 'shared/coordinates'

export default class Parcel extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }

  render() {
    let { id, x, y } = this.props
    if (!id && !isNaN(x) && !isNaN(y)) {
      id = buildCoordinate(x, y)
    }
    return (
      <AssetLoader
        assetId={id}
        assetType={ASSET_TYPES.parcel}
        {...this.props}
      />
    )
  }
}
