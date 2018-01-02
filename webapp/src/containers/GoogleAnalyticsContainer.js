import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectors } from '../reducers'

class GoogleAnalyticsContainer extends React.Component {
  static propTypes = {
    ethereum: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.configurated = false
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.shouldConfig()) {
      this.config()
    }
  }

  shouldConfig() {
    return !this.configurated && !!this.props.ethereum
  }

  config() {
    if (!window.gtag) {
      throw new Error(
        'Tried to config google analytics tracking code without injecting the script on the HTML first'
      )
    }

    const { address } = this.props.ethereum

    window.gtag('js', new Date())
    window.gtag('config', window.GA_TRACKING_ID, {
      user_id: address
    })
    this.configurated = true
  }

  render() {
    return null
  }
}

export default connect(
  state => ({
    ethereum: selectors.getEthereumConnection(state)
  }),
  {}
)(GoogleAnalyticsContainer)
