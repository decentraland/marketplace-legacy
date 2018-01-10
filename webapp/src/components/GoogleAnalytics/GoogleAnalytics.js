import React from 'react'
import PropTypes from 'prop-types'

export default class GoogleAnalytics extends React.PureComponent {
  static propTypes = {
    address: PropTypes.string
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
    return !this.configurated && !!this.props.address
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

    this.configurated = true
  }

  render() {
    return null
  }
}
