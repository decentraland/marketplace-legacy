import React from 'react'
import PropTypes from 'prop-types'

export default class GoogleAnalytics extends React.PureComponent {
  static propTypes = {
    address: PropTypes.string,
    isConnected: PropTypes.bool,
    isConnecting: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.isConfigured = false
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.shouldConfig()) {
      this.config()
    }
  }

  shouldConfig() {
    const { isConnected } = this.props
    return !this.isConfigured && isConnected
  }

  config() {
    if (!window.gtag) {
      throw new Error(
        'Tried to config google analytics tracking code without injecting the script on the HTML first'
      )
    }

    const { address } = this.props

    window.gtag('js', new Date())
    window.gtag('config', window.GA_TRACKING_ID, {
      user_id: address
    })

    this.isConfigured = true
  }

  render() {
    return null
  }
}
