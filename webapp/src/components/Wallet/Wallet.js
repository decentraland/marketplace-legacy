import React from 'react'
import PropTypes from 'prop-types'

export default class Wallet extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onConnect: PropTypes.func.isRequired,
    onFirstVisit: PropTypes.func.isRequired
  }

  static defaultProps = {
    children: null,
    onConnect: () => {},
    onFirstVisit: () => {}
  }

  componentWillMount() {
    const { onConnect, onFirstVisit } = this.props
    onConnect()
    if (!localStorage.getItem('seenTermsModal')) {
      onFirstVisit()
    }
  }

  render() {
    const { children } = this.props
    return children
  }
}
