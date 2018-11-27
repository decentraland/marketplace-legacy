import React from 'react'
import PropTypes from 'prop-types'

import { parcelType } from 'components/types'
import Collapsable from 'components/Collapsable'
import ParcelCoord from './ParcelCoord'
import './ParcelCoords.css'

const MAX_PARCEL_COORD_HEIGHT = 47

export default class ParcelCoords extends React.PureComponent {
  static propTypes = {
    ...ParcelCoord.propTypes,
    children: PropTypes.node,
    parcels: PropTypes.arrayOf(parcelType),
    isCollapsable: PropTypes.bool
  }

  static defaultProps = {
    isCollapsable: true
  }

  render() {
    const { children, parcels, isCollapsable, ...parcelCoordProps } = this.props
    const maxHeight = isCollapsable ? MAX_PARCEL_COORD_HEIGHT : Infinity

    return (
      <div className="ParcelCoords">
        <Collapsable maxHeight={maxHeight}>
          {children ||
            parcels.map((parcel, index) => (
              <ParcelCoord key={index} parcel={parcel} {...parcelCoordProps} />
            ))}
        </Collapsable>
      </div>
    )
  }
}
