import React from 'react'
import { Link } from 'react-router-dom'
import locations from 'locations'
import { buildCoordinate } from 'lib/utils'

class CoordinateLink extends React.PureComponent {
  render() {
    const { parcel } = this.props
    const coord = buildCoordinate(parcel.x, parcel.y)
    return <Link to={locations.parcelDetail(parcel.x, parcel.y)}>{coord}</Link>
  }
}

export default CoordinateLink
