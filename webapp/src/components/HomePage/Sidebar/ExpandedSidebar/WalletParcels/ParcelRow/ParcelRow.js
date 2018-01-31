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

  handleCancel = () => {
    this.setState({ editing: false })
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
    const data = this.props.parcel
    const newData = newParcel.data

    return (
      data.name !== newData.name || data.description !== newData.description
    )
  }

  render() {
    const { parcel, className } = this.props

    return (
      <div className={className}>
        {this.state.editing || parcel.isEditing ? (
          <ParcelRowEdit
            parcel={parcel}
            onSubmit={this.handleSubmit}
            onCancel={this.handleCancel}
          />
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
