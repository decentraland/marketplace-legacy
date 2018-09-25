import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Message } from 'semantic-ui-react'

import { locations } from 'locations'
import { transactionType } from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'

import './TxStatusAsset.css'

export default class TxStatusAsset extends React.PureComponent {
  static propTypes = {
    transactions: PropTypes.arrayOf(transactionType),
    name: PropTypes.object.isRequired
  }

  static defaultProps = {
    transactions: []
  }

  render() {
    const { transactions, name } = this.props

    return transactions.length ? (
      <Message warning className="TxStatusAsset">
        <T
          id="transaction_status.parcel.still_pending"
          values={{
            parcel_name: name,
            transactions_count: transactions.length
          }}
        />
        <br />
        <T
          id="transaction_status.see_activity"
          values={{
            activity_link: (
              <Link to={locations.activity()}>
                {t('transaction_status.activity_page')}
              </Link>
            )
          }}
        />
      </Message>
    ) : null
  }
}
