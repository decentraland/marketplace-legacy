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

  handleOnClick = () => {
    const { onClick, parcel } = this.props
    if (onClick) {
      onClick(parcel)
    }
  }

  render() {
    const { parcel, onClick } = this.props

    return (
      <div
        className={`ParcelAttributes ${onClick ? 'clickeable' : ''}`}
        onClick={this.handleOnClick}
      >
        <div className="coords">
          <Icon name="map marker alternate" />
          <span className="coord">{parcel.id}</span>
        </div>
      </div>
    )
  }
}
