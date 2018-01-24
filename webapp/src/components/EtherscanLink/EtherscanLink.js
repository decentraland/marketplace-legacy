import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function EtherscanLink({ address, tx, className, target, text }) {
  if (!address && !tx) {
    console.warn(
      'Tried to render an EtherscanLink without either an address or tx hash. Please supply one of those'
    )
    return null
  }

  // TODO: Use the wallet network to get correct etherscan subdomain.
  // See: https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#construction_worker-network-check.
  // it would be nice to have it in commons, under eth, and as a util function here in the marketplace

  const origin = 'https://etherscan.io'
  const pathname = address ? `/address/${address}` : `/tx/${tx}`
  const href = `${origin}${pathname}`

  return (
    <Link className={className} to={href} target={target}>
      {text || href}
    </Link>
  )
}

EtherscanLink.propTypes = {
  address: PropTypes.string,
  tx: PropTypes.string,
  className: PropTypes.string,
  target: PropTypes.string,
  text: PropTypes.string
}

EtherscanLink.defaultProps = {
  className: 'etherscan-link',
  target: '_blank',
  text: null
}
