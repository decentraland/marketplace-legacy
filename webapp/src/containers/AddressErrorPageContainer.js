import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectors } from '../reducers'

import AddressErrorPage from '../components/AddressErrorPage'

class AddressErrorPageContainer extends React.Component {
  static propTypes = {
    ethereum: PropTypes.object
  }

  getAddress() {
    const { ethereum } = this.props
    return ethereum ? ethereum.address : null
  }

  render() {
    return <AddressErrorPage address={this.getAddress()} />
  }
}

export default connect(
  state => ({
    ethereum: selectors.getEthereumConnection(state)
  }),
  {}
)(AddressErrorPageContainer)
