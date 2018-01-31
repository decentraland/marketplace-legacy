import React from 'react'
import PropTypes from 'prop-types'

import Navbar from './Navbar'

import './StaticPage.css'

export default class StaticPage extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  static defaultProps = {
    className: ''
  }

  render() {
    const { className, children } = this.props
    return (
      <div className={`StaticPage ${className}`}>
        <Navbar />

        <div className="content">
          <div>{children}</div>
        </div>
      </div>
    )
  }
}
