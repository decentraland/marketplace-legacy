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
    parcel: parcelType
  }

  static defaultProps = {
    size: 'large'
  }

  render() {
    const { size, parcel } = this.props
    if (!parcel) {
      return (
        <Header size={size} className="ParcelName">
          Loading&hellip;
        </Header>
      )
    }
    const { x, y, data } = parcel
    return (
      <Header size={size} className="ParcelName">
        {data.name ? <span>{data.name}&nbsp;</span> : null}
        <Link to={locations.parcelMapDetail(x, y, buildCoordinate(x, y))}>
          <Icon name="marker" />
          {x}, {y}
        </Link>
      </Header>
    )
  }
}
