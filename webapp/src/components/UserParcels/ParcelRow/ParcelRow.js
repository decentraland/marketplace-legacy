import React from 'react'
import ParcelRowEdit from '../ParcelRowEdit'
import ParcelRowData from '../ParcelRowData'

class ParcelRow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false
    }
  }

  startEditing = () => {
    this.setState({ editing: true })
  }

  finishEditing = newParcel => {
    this.setState({ editing: false })

    if (this.hasEdits(newParcel)) {
      this.props.onEdit(newParcel)
    }
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
          <ParcelRowEdit parcel={parcel} finishEditing={this.finishEditing} />
        ) : (
          <ParcelRowData parcel={parcel} startEditing={this.startEditing} />
        )}
      </div>
    )
  }
}

export default ParcelRow
