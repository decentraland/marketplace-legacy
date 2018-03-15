import React from 'react'
import PropTypes from 'prop-types'

import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
import TranslationProvider from './TranslationProvider'
import { localStorage } from 'lib/localStorage'

import './Page.css'

export default class Page extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onFetchDistricts: PropTypes.func.isRequired,
    onFirstVisit: PropTypes.func.isRequired
  }

  static defaultProps = {
    children: null,
    onFetchDistricts: () => {},
    onFirstVisit: () => {}
  }

  componentWillMount() {
    const { onFetchDistricts, onFirstVisit } = this.props

    onFetchDistricts()
    if (!localStorage.getItem('seenTermsModal')) {
      onFirstVisit()
    }
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
