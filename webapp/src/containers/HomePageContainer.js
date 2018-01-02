import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { connectWeb3 } from '../actions'

import HomePage from '../components/HomePage'

class HomePageContainer extends React.Component {
  static propTypes = {
    connectWeb3: PropTypes.func
  }

  componentDidMount() {
    this.props.connectWeb3()
  }

  render() {
    return <HomePage isReady={true} />
  }
}

export default connect(state => ({}), { connectWeb3 })(HomePageContainer)
