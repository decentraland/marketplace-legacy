import React from 'react'

import ParcelRowEdit from '../ParcelRowEdit'
import ParcelRowData from '../ParcelRowData'

class ParcelRow extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      editing: false
    }
  }

  handleEdit = () => {
    this.setState({ editing: true })
  }

  handleSubmit = newParcel => {
    this.setState({ editing: false })

    if (this.hasEdits(newParcel)) {
      this.props.onEdit(newParcel)
    }
  }

  handleTransfer = () => {
    const { parcel } = this.props
    this.props.onTransfer(parcel)
  }

  hasEdits(newParcel) {
    const { parcel } = this.props

    return (
      newParcel.name !== parcel.name ||
      newParcel.description !== parcel.description
    )
  }

  render() {
    const { parcel, className } = this.props

    return (
      <div className={className}>
        {this.state.editing ? (
          <ParcelRowEdit parcel={parcel} onSubmit={this.handleSubmit} />
        ) : (
          <ParcelRowData
            parcel={parcel}
            onEdit={this.handleEdit}
            onTransfer={this.handleTransfer}
          />
        )}
      </div>
    )
  }
}

export default ParcelRow
