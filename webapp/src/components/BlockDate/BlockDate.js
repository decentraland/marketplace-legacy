import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { distanceInWordsToNow } from 'lib/utils'
import { getEtherscanHref } from 'modules/transaction/utils'

export default class BlockDate extends React.PureComponent {
  static propTypes = {
    network: PropTypes.string,
    blockNumber: PropTypes.number.isRequired,
    blockTime: PropTypes.string,
    target: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    target: '_blank'
  }

  render() {
    const { network, blockNumber, blockTime, target, className } = this.props
    const href = getEtherscanHref({ blockNumber }, network)

    return (
      <Link
        className={className}
        to={href}
        target={target}
        title={`Block #${blockNumber}`}
      >
        {blockTime
          ? distanceInWordsToNow(parseInt(blockTime, 10))
          : `#${blockNumber}`}
      </Link>
    )
  }
}
