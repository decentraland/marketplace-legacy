import React from 'react'
import PropTypes from 'prop-types'

import Navbar from 'components/Navbar'
import Footer from 'components/Footer'

import './Page.css'

export default class Page extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  static defaultProps = {
    children: null
  }

  render() {
    const { children } = this.props

    return (
      <React.Fragment>
        <Navbar />
        <div className="Page">
          {children}
          <Footer />
        </div>
      </React.Fragment>
    )
  }
}
