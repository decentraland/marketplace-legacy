import React from 'react'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { splitCoordinate } from 'lib/utils'

export default class ContributionLink extends React.PureComponent {
  render() {
    const { contribution } = this.props
    const district = contribution.district
    if (!district) return null
    const [x, y] = splitCoordinate(district.center)
    return <Link to={locations.parcelMapDetail(x, y)}>{district.name}</Link>
  }
}
