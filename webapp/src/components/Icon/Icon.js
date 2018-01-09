import React from 'react'
import PropTypes from 'prop-types'

import './Icon.css'

export default class Icon extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  render() {
    let { name, className } = this.props
    className += ' Icon'

    if (name) {
      className += ` Icon-${name}`
    }

    return <i className={className} />
  }
}
