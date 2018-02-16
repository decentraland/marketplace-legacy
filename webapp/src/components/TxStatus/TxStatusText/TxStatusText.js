import React from 'react'
import PropTypes from 'prop-types'
import { txUtils } from 'decentraland-commons'

import EtherscanLink from 'components/EtherscanLink'

export default class TxStatusText extends React.PureComponent {
  static propTypes = {
    txHash: PropTypes.string.isRequired,
    txStatus: PropTypes.string.isRequired
  }

  render() {
    const { txHash, txStatus } = this.props

    const isPending = txStatus === txUtils.TRANSACTION_STATUS.pending
    const isFailure = txStatus === txUtils.TRANSACTION_STATUS.failed

    return isPending || isFailure ? (
      <div className="TxStatusText">
        {isPending
          ? 'The transaction is waiting to be confirmed.'
          : 'Your transaction failed, you can try sending a new one.'}
        &nbsp;You can check Etherscan&nbsp;
        <EtherscanLink txHash={txHash}>here</EtherscanLink>
      </div>
    ) : null
  }
}
