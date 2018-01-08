import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectors } from 'reducers'

import intercomUtils from 'lib/intercomUtils'

import './Intercom.css'

class IntercomContainer extends React.Component {
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

  injectIntercom() {
    const address = this.getAddress()

    intercomUtils
      .inject()
      .then(() => intercomUtils.render(address))
      .catch(err => console.error('Could not inject intercom', err))
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
)(IntercomContainer)
