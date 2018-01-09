import React from 'react'
import PropTypes from 'prop-types'
import intercomUtils from './utils'

import './Intercom.css'

export default class Intercom extends React.PureComponent {
  static propTypes = {
    ethereum: PropTypes.object
  }

  componentDidUpdate(prevProps, prevState) {
    this.injectIntercom()
  }

  getAddress() {
    const { ethereum } = this.props
    return ethereum ? ethereum.address : null
  }

  async injectIntercom() {
    const address = this.getAddress()
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
