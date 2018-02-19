import React from 'react'
import PropTypes from 'prop-types'
import { txUtils } from 'decentraland-commons'

import { Icon } from 'semantic-ui-react'
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
    let iconName = 'check circle outline'
    let iconTooltip = 'Transaction confirmed'

    if (txStatus === txUtils.TRANSACTION_STATUS.pending) {
      iconName = 'warning sign'
      iconTooltip = 'Transaction pending'
    } else if (txStatus === txUtils.TRANSACTION_STATUS.failed) {
      iconName = 'remove circle outline'
      iconTooltip = 'Transaction failed'
    }

    const classes = `TxStatusIcon ${className}`.trim()

    return (
      <span
        data-balloon-pos="up"
        data-balloon={iconTooltip}
        className={classes}
      >
        <EtherscanLink txHash={txHash}>
          <Icon name={iconName} className={txStatus} />
        </EtherscanLink>
      </span>
    )
  }
}
