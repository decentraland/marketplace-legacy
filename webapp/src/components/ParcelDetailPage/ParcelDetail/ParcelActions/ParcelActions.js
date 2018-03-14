import React from 'react'
import PropTypes from 'prop-types'

import { Button, Icon } from 'semantic-ui-react'
import { hasPublication } from 'lib/parcelUtils'
import { parcelType, publicationType } from 'components/types'
import { t } from 'modules/translation/utils'

import './ParcelActions.css'

export default class ParcelActions extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    publications: PropTypes.objectOf(publicationType),
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

  isOnSale() {
    const { parcel, publications } = this.props
    return hasPublication(parcel, publications)
  }

  handleSell = () => {
    const { parcel, onSell, onCancelSale } = this.props
    if (this.isOnSale()) {
      onCancelSale(parcel)
    } else {
      onSell(parcel)
    }
  }

  render() {
    const { parcel } = this.props
    if (!parcel) {
      return null
    }
    return (
      <span className="ParcelActions">
        <Button onClick={this.handleEdit} size="tiny">
          <Icon name="edit" />
          {t('parcel_detail.actions.edit')}
        </Button>

        {this.isOnSale() ? null : (
          <Button onClick={this.handleTransfer} size="tiny">
            <Icon name="exchange" />
            {t('parcel_detail.actions.transfer')}
          </Button>
        )}

        <Button onClick={this.handleSell} size="tiny">
          <Icon name={this.isOnSale() ? 'cancel' : 'tag'} />
          {this.isOnSale()
            ? t('parcel_detail.actions.cancel')
            : t('parcel_detail.actions.sell')}
        </Button>
      </span>
    )
  }
}
