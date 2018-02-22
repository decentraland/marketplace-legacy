import React from 'react'
import PropTypes from 'prop-types'
import { parcelType } from 'components/types'
import { Link } from 'react-router-dom'
import { Header, Icon } from 'semantic-ui-react'
import { locations } from 'locations'
import './ParcelName.css'
import { buildCoordinate } from 'lib/utils'

export default class ParcelName extends React.PureComponent {
  static propTypes = {
    size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'huge']),
    parcel: parcelType,
    x: PropTypes.number,
    y: PropTypes.number
  }

  static defaultProps = {
    size: 'large',
    x: null,
    y: null
  }

  render() {
    let { size, parcel, x, y } = this.props
    if (!parcel && x == null && y == null) {
      return (
        <Header size={size} className="ParcelName">
          Loading&hellip;
        </Header>
      )
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
      <Header size={size} className={classes}>
        {name ? <span>{name}&nbsp;</span> : null}
        <Link to={locations.parcelMapDetail(x, y, buildCoordinate(x, y))}>
          <Icon name="marker" />
          {x}, {y}
        </Link>
      </Header>
    )
  }
}
