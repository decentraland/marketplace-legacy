import React from 'react'
import PropTypes from 'prop-types'

import EtherscanLink from 'components/EtherscanLink'
import { getContractAddress } from 'modules/wallet/utils'

export default class ContractLink extends React.PureComponent {
  static propTypes = {
    contractName: PropTypes.string.isRequired
  }

  render() {
    const { contractName } = this.props

    return (
      <EtherscanLink address={getContractAddress(contractName)}>
        {contractName}
      </EtherscanLink>
    )
  }
}
