import React from 'react'
import PropTypes from 'prop-types'
import { localStorage } from 'lib/localStorage'

export default class Wallet extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onConnect: PropTypes.func.isRequired,
    onFetchDistricts: PropTypes.func.isRequired,
    onFirstVisit: PropTypes.func.isRequired
  }

  static defaultProps = {
    children: null,
    onConnect: () => {},
    onFetchDistricts: () => {},
    onFirstVisit: () => {}
  }

  componentWillMount() {
    const { onConnect, onFetchDistricts, onFirstVisit } = this.props
    onConnect()
    onFetchDistricts()
    if (!localStorage.getItem('seenTermsModal')) {
      onFirstVisit()
    }
  }

  render() {
    const { children } = this.props
    return children
  }
}
