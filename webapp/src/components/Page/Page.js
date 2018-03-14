import React from 'react'
import PropTypes from 'prop-types'

import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
import TranslationProvider from './TranslationProvider'

import './Page.css'

export default class Page extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  render() {
    const { children } = this.props

    return (
      <TranslationProvider>
        <Navbar />
        <div className="Page">
          {children}
          <Footer />
        </div>
      </TranslationProvider>
    )
  }
}
