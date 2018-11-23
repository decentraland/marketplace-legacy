import React from 'react'
import PropTypes from 'prop-types'

import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
import { hasAgreedToTerms } from 'modules/terms/utils'

import './Page.css'

export default class Page extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isRootPage: PropTypes.bool.isRequired,
    isAuctionPage: PropTypes.bool.isRequired,
    onFetchDistricts: PropTypes.func.isRequired,
    onFirstVisit: PropTypes.func.isRequired
  }

  static defaultProps = {
    children: null,
    isRootPage: false,
    isAuctionPage: false,
    onFetchDistricts: () => {},
    onFirstVisit: () => {}
  }

  componentWillMount() {
    const { onFetchDistricts, isRootPage, isAuctionPage } = this.props

    onFetchDistricts()
    this.showTermsModal(isRootPage, isAuctionPage)
  }

  componentWillReceiveProps(nextProps) {
    this.showTermsModal(nextProps.isRootPage, nextProps.isAuctionPage)
  }

  showTermsModal(isRootPage, isAuctionPage) {
    if (this.shouldTriggerTermsModal(isRootPage, isAuctionPage)) {
      this.props.onFirstVisit()
    }
  }

  shouldTriggerTermsModal(isRootPage, isAuctionPage) {
    return !isRootPage && !isAuctionPage && !hasAgreedToTerms()
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
