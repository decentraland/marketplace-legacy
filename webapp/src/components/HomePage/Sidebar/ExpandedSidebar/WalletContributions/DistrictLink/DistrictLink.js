import React from 'react'
import { Link } from 'react-router-dom'
import locations from 'locations'
import { splitCoordinate } from 'lib/utils'

class DistrictLink extends React.PureComponent {
  render() {
    const { contribution } = this.props
    const district = contribution.district
    if (!district) return null
    const [x, y] = splitCoordinate(district.center)
    return <Link to={locations.parcelDetail(x, y)}>{district.name}</Link>
  }
}

export default DistrictLink
