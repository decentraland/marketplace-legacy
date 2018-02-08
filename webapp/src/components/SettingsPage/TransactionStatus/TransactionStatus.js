import React from 'react'
import PropTypes from 'prop-types'

import EtherscanLink from 'components/EtherscanLink'
import { transactionType } from 'components/types'

export default class TransactionStatus extends React.PureComponent {
  static propTypes = {
    transaction: transactionType,
    isPending: PropTypes.bool,
    isFailure: PropTypes.bool
  }

  render() {
    const { transaction, isPending, isFailure } = this.props

    return isPending || isFailure ? (
      <small className="TransactionStatus">
        {isPending
          ? 'You have a pending transaction waiting to be confirmed.'
          : 'Your transaction failed, you can try sending a new one.'}
        &nbsp;You can check Etherscan&nbsp;

        <EtherscanLink txHash={transaction.hash}>here</EtherscanLink>
      </small>
    ) : null
  }
}
