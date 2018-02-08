import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default class EtherscanLink extends React.PureComponent {
  static propTypes = {
    address: PropTypes.string,
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
    const { address, txHash, className, target, text, children } = this.props

    if (!address && !txHash) {
      console.warn(
        'Tried to render an EtherscanLink without either an address or tx hash. Please supply one of those'
      )
      return null
    }

    // TODO: Use the wallet network to get correct etherscan subdomain.
    // See: https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#construction_worker-network-check.
    // We can use `eth.getNetwork`

    const origin = 'https://etherscan.io'
    const pathname = address ? `/address/${address}` : `/tx/${txHash}`
    const href = `${origin}${pathname}`

    return (
      <Link className={className} to={href} target={target}>
        {children || text || href}
      </Link>
    )
  }
}
