import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'components/Icon'
import { parcelType } from 'components/types'

import CoordinateLink from '../CoordinateLink'

class ParcelRowData extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    onEdit: PropTypes.func,
    onTransfer: PropTypes.func
  }

  getPrice() {
    const { parcel } = this.props
    return parcel.price ? `${parcel.price} MANA` : '--'
  }

  render() {
    const { parcel, onTransfer } = this.props

    return (
      <div className="table-row">
        <div className="col col-coord">
          <CoordinateLink parcel={parcel} />
        </div>
        <div className="col col-price">{this.getPrice()}</div>
        {/*<div className="col col-name">{parcel.name}</div>*/}

        <div className="col col-actions">
          {/*<div onClick={onEdit}>
            <Icon name="pencil" />
            edit
          </div>*/}
          <div onClick={onTransfer}>
            <Icon name="exchange" />
            transfer
          </div>
        </div>
      </div>
    )
  }
}

export default ParcelRowData
