import React from 'react'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { parcelType } from 'components/types'

export default class ParcelDetailLink extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired
  }

  render() {
    const { parcel } = this.props
    return (
      <Link to={locations.parcelDetail(parcel.x, parcel.y)}>{parcel.id}</Link>
    )
  }
}
