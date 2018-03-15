import React from 'react'
import PropTypes from 'prop-types'

export default class Wallet extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onConnect: PropTypes.func.isRequired,
  }

  static defaultProps = {
    children: null,
    onConnect: () => {}
  }

  componentWillMount() {
    const { onConnect } = this.props
    onConnect()
  }

  render() {
    const { children } = this.props
    return children
  }
}
