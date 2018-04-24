import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { txUtils } from 'decentraland-eth'

import { locations } from 'locations'
import { t, t_html } from 'modules/translation/utils'

import './TxStatusText.css'

export default class TxStatusText extends React.PureComponent {
  static propTypes = {
    txHash: PropTypes.string.isRequired,
    txStatus: PropTypes.string.isRequired
  }

  render() {
    const { txStatus } = this.props

    const isPending = txStatus === txUtils.TRANSACTION_STATUS.pending
    const isFailure = txStatus === txUtils.TRANSACTION_STATUS.failed

    return isPending || isFailure ? (
      <div className="TxStatusText">
        {isPending
          ? t('transaction_status.text.pending')
          : t('transaction_status.text.failed')}
        &nbsp;
        {t_html('transaction_status.see_activity', {
          activity_link: <Link to={locations.activity}>activity page</Link>
        })}
      </div>
    ) : null
  }
}
