import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Icon } from 'semantic-ui-react'
import { locations } from 'locations'
import { parcelType } from 'components/types'

import './ParcelName.css'
import { buildCoordinate } from 'lib/utils'

export default class ParcelName extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    x: PropTypes.number,
    y: PropTypes.number
  }

  static defaultProps = {
    x: null,
    y: null
  }

  render() {
    let { parcel, x, y } = this.props
    if (!parcel && x == null && y == null) {
      return <div className="ParcelName">Loading&hellip;</div>
    }
    let classes = 'ParcelName'
    let name
    if (parcel) {
      x = parcel.x
      y = parcel.y
      name = parcel.data.name
    }
    if (!name) {
      classes += ' no-name'
    }
    return (
      <div className={classes}>
        {name ? <span>{name}&nbsp;</span> : null}
        <Link to={locations.parcelMapDetail(x, y, buildCoordinate(x, y))}>
          <Icon name="marker" />
          {x}, {y}
        </Link>
      </div>
    )
  }
}
