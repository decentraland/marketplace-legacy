import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { txUtils } from 'decentraland-eth'

import { locations } from 'locations'
import { isPending as isTransactionPending } from '@dapps/modules/transaction/utils'
import { t, T } from '@dapps/modules/translation/utils'

import './TxStatusText.css'

export default class TxStatusText extends React.PureComponent {
  static propTypes = {
    txHash: PropTypes.string.isRequired,
    txStatus: PropTypes.string.isRequired
  }

  render() {
    const { txStatus } = this.props

    const isPending = isTransactionPending(txStatus)
    const isFailure = txStatus === txUtils.TRANSACTION_TYPES.reverted

    return isPending || isFailure ? (
      <div className="TxStatusText">
        {isPending
          ? t('transaction_status.text.pending')
          : t('transaction_status.text.failed')}
        &nbsp;
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
      </div>
    ) : null
  }
}
