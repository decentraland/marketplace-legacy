import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { eth } from 'decentraland-eth'
import { distanceInWordsToNow } from 'lib/utils'

export default class BlockDate extends React.PureComponent {
  static propTypes = {
    network: PropTypes.string,
    block: PropTypes.number.isRequired,
    target: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    target: '_blank'
  }

  constructor(props) {
    super(props)
    this.state = {
      timestamp: null
    }
  }

  async componentWillMount() {
    try {
      eth.wallet.getWeb3().eth.getBlock(this.props.block, (error, block) => {
        if (block) {
          const { timestamp } = block
          this.setState({ timestamp })
        }
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  render() {
    const { network, block, target, className } = this.props
    const { timestamp } = this.state

    const subdomain = network && network !== 'mainnet' ? network + '.' : ''
    const href = `https://${subdomain}etherscan.io/block/${block}`
    const text = timestamp
      ? distanceInWordsToNow(timestamp * 1000)
      : `#${block}`

    return (
      <Link
        className={className}
        to={href}
        target={target}
        title={`Block #${block}`}
      >
        {text}
      </Link>
    )
  }
}
