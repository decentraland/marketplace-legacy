import React from 'react'
import PropTypes from 'prop-types'

import './InputGroup.css'

export default class InputGroup extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return <div className="InputGroup">{this.props.children}</div>
  }
}
