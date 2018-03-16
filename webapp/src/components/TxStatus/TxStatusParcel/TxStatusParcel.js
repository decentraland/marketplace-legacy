import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { Message } from 'semantic-ui-react'
import { transactionType, parcelType } from 'components/types'
import ParcelName from 'components/ParcelName'
import { t_html } from 'modules/translation/utils'

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
        {t_html('transaction_status.parcel.still_pending', {
          parcel_name: <ParcelName parcel={parcel} />,
          transactions_count: transactions.length
        })}
        <br />
        {t_html('transaction_status.see_activity', {
          activity_link: <Link to={locations.activity}>activity page</Link>
        })}
      </Message>
    ) : null
  }
}
