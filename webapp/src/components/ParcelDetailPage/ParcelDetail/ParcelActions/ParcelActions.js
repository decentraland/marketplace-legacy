import React from 'react'
import PropTypes from 'prop-types'
import { parcelType } from 'components/types'
import { Button, Icon } from 'semantic-ui-react'
import './ParcelActions.css'

export default class ParcelActions extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    onTransfer: PropTypes.func.isRequired
  }

  handleTransfer = () => {
    const { parcel, onTransfer } = this.props
    onTransfer(parcel)
  }

  handleEdit = () => {
    const { parcel, onEdit } = this.props
    onEdit(parcel)
  }

  handleSell = () => {
    const { parcel, onSell } = this.props
    onSell(parcel)
  }

  render() {
    const { parcel } = this.props
    if (!parcel) {
      return null
    }
    return (
      <span className="ParcelActions">
        <Button onClick={this.handleEdit} size="tiny">
          <Icon name="edit" />Edit
        </Button>
        <Button onClick={this.handleTransfer} size="tiny">
          <Icon name="exchange" />Trasfer
        </Button>
        <Button onClick={this.handleSell} size="tiny">
          <Icon name="tag" />Sell
        </Button>
      </span>
    )
  }
}
