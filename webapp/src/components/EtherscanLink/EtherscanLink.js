import React from 'react'
import PropTypes from 'prop-types'

import { getEtherscanHref } from '@dapps/modules/transaction/utils'
import { getContractAddress } from 'modules/wallet/utils'

export default class EtherscanLink extends React.PureComponent {
  static propTypes = {
    network: PropTypes.string,
    address: PropTypes.string,
    name: PropTypes.string,
    txHash: PropTypes.string,
    className: PropTypes.string,
    target: PropTypes.string,
    text: PropTypes.string,
    children: PropTypes.node
  }

  static defaultProps = {
    className: 'etherscan-link',
    target: '_blank',
    text: null
  }

  render() {
    const { address, name, txHash } = this.props

    if (!address && !txHash & !name) {
      console.warn(
        'Tried to render an EtherscanLink without either an address or tx hash. Please supply one of those'
      )
      return null
    }

    const { network, className, target, text, children } = this.props

    const href = getEtherscanHref(
      {
        address: !address && name ? getContractAddress(name) : address,
        txHash
      },
      network
    )

    return (
      <a className={className} href={href} target={target}>
        {children || text || href}
      </a>
    )
  }
}
