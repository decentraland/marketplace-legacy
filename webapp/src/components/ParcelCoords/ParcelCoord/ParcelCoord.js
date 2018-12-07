import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'

import Chip from 'components/Chip'
import { parcelType } from 'components/types'

export default class ParcelCoord extends React.PureComponent {
  static propTypes = {
    ...Chip.propTypes,
    parcel: parcelType,
    isLoading: PropTypes.bool
  }

  handleOnClick = () => {
    const { onClick, parcel } = this.props
    onClick(parcel)
  }

  handleOnDelete = () => {
    const { onDelete, parcel } = this.props
    onDelete(parcel)
  }

  render() {
    const { parcel, onClick, onDelete, isLoading, ...chipProps } = this.props

    // We use `className="map alternate"` instead of `name="map marker alternate"` on Icon because
    // semantic wrongly throws on the latter as of version 0.78.2
    return (
      <div className="ParcelCoord">
        <Chip
          parcel={parcel}
          onClick={onClick ? this.handleOnClick : null}
          onDelete={onDelete ? this.handleOnDelete : null}
          {...chipProps}
        >
          <Icon
            name="marker"
            loading={isLoading}
            className={isLoading ? 'refresh' : 'map alternate'}
          />
          <span>{parcel.id}</span>
        </Chip>
      </div>
    )
  }
}
