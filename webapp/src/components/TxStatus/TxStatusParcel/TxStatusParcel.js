import React from 'react'
import PropTypes from 'prop-types'

import { Message } from 'semantic-ui-react'
import { transactionType, parcelType } from 'components/types'
import ParcelName from 'components/ParcelName'

import './TxStatusParcel.css'

export default class TxStatusParcel extends React.PureComponent {
  static propTypes = {
    transactions: PropTypes.arrayOf(transactionType),
    parcel: parcelType
  }

  static defaultProps = {
    transactions: []
  }

  render() {
    const { transactions, parcel } = this.props

    return transactions.length ? (
      <Message warning className="TxStatusParcel">
        <ParcelName parcel={parcel} />&nbsp;&nbsp;still has&nbsp;
        {transactions.length} pending transactions
      </Message>
    ) : null
  }
}
