import React from 'react'
import PropTypes from 'prop-types'

import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
import TranslationProvider from './TranslationProvider'
import { getLocalStorage } from 'decentraland-dapps/dist/lib/localStorage'

import './Page.css'

export default class Page extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isStatic: PropTypes.bool.isRequired,
    onFetchDistricts: PropTypes.func.isRequired,
    onFirstVisit: PropTypes.func.isRequired
  }

  static defaultProps = {
    children: null,
    isStatic: false,
    onFetchDistricts: () => {},
    onFirstVisit: () => {}
  }

  get hasAcceptedTerms() {
    const localStorage = getLocalStorage()
    return localStorage.getItem('seenTermsModal')
  }

  componentWillMount() {
    const { onFetchDistricts } = this.props

    onFetchDistricts()

    this.checkPopTerms()
  }

  componentWillReceiveProps() {
    this.checkPopTerms()
  }

  checkPopTerms() {
    const { onFirstVisit, isStatic } = this.props

    const shouldTriggerTermsModal = !isStatic && !this.hasAcceptedTerms

    if (shouldTriggerTermsModal) {
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
