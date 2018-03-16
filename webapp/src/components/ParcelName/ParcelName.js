import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Icon } from 'semantic-ui-react'
import { locations } from 'locations'
import { parcelType, districtType } from 'components/types'

import './ParcelName.css'
import { buildCoordinate } from 'lib/utils'

export default class ParcelName extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    x: PropTypes.number,
    y: PropTypes.number,
    districts: PropTypes.objectOf(districtType)
  }

  static defaultProps = {
    x: null,
    y: null
  }

  render() {
    let { parcel, x, y, districts } = this.props
    if (!parcel && x == null && y == null) {
      return (
        <div className="ParcelName">
          <span className="name">&hellip;</span>
        </div>
      )
    }
    let classes = 'ParcelName'
    let name
    if (parcel) {
      x = parcel.x
      y = parcel.y
      if (districts && parcel.district_id in districts) {
        name = districts[parcel.district_id].name
      }
      if (parcel.data.name) {
        name = parcel.data.name
      }
    }
    if (!name) {
      classes += ' no-name'
    }
    return (
      <div className={classes}>
        {name ? <span className="name">{name}&nbsp;</span> : null}
        <Link
          to={locations.parcelMapDetail(x, y, buildCoordinate(x, y))}
          className="ui"
        >
          <Icon name="marker" />
          {x}, {y}
        </Link>
      </div>
    )
  }
}
