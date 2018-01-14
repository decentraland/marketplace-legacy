import React from 'react'
import ParcelRow from '../ParcelRow'

class ParcelTable extends React.PureComponent {
  render() {
    const { parcels, onEdit } = this.props

    if (parcels.length) {
      return (
        <div className="table">
          <div className="table-row table-header">
            <div className="col col-coord">COORD</div>
            <div className="col col-price">PURCHASE PRICE</div>
            <div className="col col-name">NAME</div>
            <div className="col col-actions" />
          </div>

          {parcels.map((parcel, index) => (
            <ParcelRow
              key={index}
              parcel={parcel}
              className={index % 2 === 0 ? 'gray' : ''}
              onEdit={onEdit}
            />
          ))}
        </div>
      )
    } else {
      return <div className="table-row-empty">You don&apos;t own any land.</div>
    }
  }
}

export default ParcelTable
