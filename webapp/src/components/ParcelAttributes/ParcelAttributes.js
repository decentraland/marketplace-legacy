import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'

import { parcelType } from 'components/types'
import './ParcelAttributes.css'

export default class ParcelAttributes extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    onClick: PropTypes.func
  }

  static defaultProps = {
    onClick: () => {}
  }

  handleOnClick = () => {
    const { onClick, parcel } = this.props
    onClick(parcel)
  }

  render() {
    const { parcel } = this.props

    // const Wrapper = withLink ? Link : React.Fragment
    // const wrapperProps = withLink
    //   ? { to: locations.parcelDetail(parcel.x, parcel.y) }
    //   : {}

    return (
      <div className="ParcelAttributes" onClick={this.handleOnClick}>
        <div className="coords">
          <Icon name="map marker alternate" />
          <span className="coord">{parcel.id}</span>
        </div>
      </div>
    )
  }
}
