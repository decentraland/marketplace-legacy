import React from 'react'
import PropTypes from 'prop-types'

import { Message } from 'semantic-ui-react'
import { transactionType, parcelType } from 'components/types'
import { ParcelName } from 'components/ParcelName'

export default class TxStatusParcel extends React.PureComponent {
  static propTypes = {
    transactions: PropTypes.arrayOf(transactionType),
    parcel: parcelType
  }

  render() {
    const { transactions, parcel } = this.props

    return transactions.length ? (
      <Message className="TxStatusParcel">
        <ParcelName size="small" parcel={parcel} />&nbsp;still has&nbsp;
        {transactions.length} pending transactions
      </Message>
    ) : null
  }
}
