import React from 'react'

import ParcelCard from 'components/ParcelCard'
import EstateCard from 'components/EstateCard'
import { assetType } from 'components/types'
import { isParcel } from 'shared/parcel'
import { isEstate } from 'shared/estate'

export default class AssetCard extends React.PureComponent {
  static propTypes = {
    asset: assetType
  }

  render() {
    const { asset } = this.props
    if (isParcel(asset)) {
      return <ParcelCard parcel={asset} {...this.props} />
    } else if (isEstate(asset)) {
      return <EstateCard estate={asset} {...this.props} />
    }
  }
}
