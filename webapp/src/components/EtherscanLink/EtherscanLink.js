import React from 'react'
import PropTypes from 'prop-types'
import { eth } from 'decentraland-commons'
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

  constructor(props) {
    super(props)
    this.mounted = false
    this.state = {
      network: null
    }
  }

  async componentWillMount() {
    this.mounted = true
    const network = await eth.getNetwork()
    if (this.mounted) {
      this.setState({ network })
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const { address, txHash, className, target, text, children } = this.props

    if (!address && !txHash) {
      console.warn(
        'Tried to render an EtherscanLink without either an address or tx hash. Please supply one of those'
      )
      return null
    }

    let origin = 'https://etherscan.io'
    if (this.state.network && this.state.network.name !== 'mainnet') {
      origin = `https://${this.state.network.name}.etherscan.io`
    }
    const pathname = address ? `/address/${address}` : `/tx/${txHash}`
    const href = `${origin}${pathname}`

    return (
      <Link className={className} to={href} target={target}>
        {children || text || href}
      </Link>
    )
  }
}
