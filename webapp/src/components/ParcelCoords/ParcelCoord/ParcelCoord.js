import React from 'react'
import { Icon } from 'semantic-ui-react'

import Chip from 'components/Chip'
import { parcelType } from 'components/types'

export default class ParcelCoord extends React.PureComponent {
  static propTypes = {
    ...Chip.propTypes,
    parcel: parcelType
  }

  handleOnClick = () => {
    const { onClick, parcel } = this.props
    if (onClick) {
      onClick(parcel)
    }
  }

  render() {
    const { parcel, ...chipProps } = this.props

    // We use `className="map alternate"` instead of `name="map marker alternate"` on Icon because
    // semantic wrongly throws on the latter as of version 0.78.2
    return (
      <div className="ParcelCoord">
        <Chip parcel={parcel} {...chipProps} onClick={this.handleOnClick}>
          <Icon name="marker" className="map alternate" />
          <span>{parcel.id}</span>
        </Chip>
      </div>
    )
  }
}
