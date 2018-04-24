import React from 'react'
import PropTypes from 'prop-types'
import { txUtils } from 'decentraland-eth'

import ConfirmedIcon from './ConfirmedIcon'
import FailedIcon from './FailedIcon'
import EtherscanLink from 'components/EtherscanLink'

import './TxStatusIcon.css'

export default class TxStatusIcon extends React.PureComponent {
  static propTypes = {
    txHash: PropTypes.string.isRequired,
    txStatus: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  render() {
    const { txHash, txStatus, className } = this.props
    let Icon = null
    let iconTooltip = ''

    if (txStatus === txUtils.TRANSACTION_STATUS.pending) return null

    if (txStatus === txUtils.TRANSACTION_STATUS.confirmed) {
      Icon = <ConfirmedIcon />
      iconTooltip = 'Transaction confirmed'
    } else if (txStatus === txUtils.TRANSACTION_STATUS.failed) {
      Icon = <FailedIcon />
      iconTooltip = 'Transaction failed'
    }

    const classes = `TxStatusIcon ${className}`.trim()

    return (
      <span
        data-balloon-pos="up"
        data-balloon={iconTooltip}
        className={classes}
      >
        <EtherscanLink txHash={txHash}>{Icon}</EtherscanLink>
      </span>
    )
  }
}
