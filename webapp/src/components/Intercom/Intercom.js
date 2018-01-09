import React from 'react'
import PropTypes from 'prop-types'
import intercomUtils from './utils'

import './Intercom.css'

export default class Intercom extends React.PureComponent {
  static propTypes = {
    address: PropTypes.string
  }

  componentDidUpdate(prevProps, prevState) {
    this.injectIntercom()
  }

  async injectIntercom() {
    const { address } = this.props

    try {
      await intercomUtils.inject()
      intercomUtils.render(address)
    } catch (e) {
      console.error('Could not inject intercom', e.message)
    }
  }

  render() {
    return null
  }
}
