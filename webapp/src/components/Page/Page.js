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
    onFetchDistricts: PropTypes.func.isRequired,
    onFirstVisit: PropTypes.func.isRequired
  }

  static defaultProps = {
    children: null,
    isRootPage: false,
    onFetchDistricts: () => {},
    onFirstVisit: () => {}
  }

  componentWillMount() {
    const { onFetchDistricts, isRootPage } = this.props

    onFetchDistricts()
    this.showTermsModal(isRootPage)
  }

  componentWillReceiveProps(nextProps) {
    this.showTermsModal(nextProps.isRootPage)
  }

  showTermsModal(isRootPage) {
    if (this.shouldTriggerTermsModal(isRootPage)) {
      this.props.onFirstVisit()
    }
  }

  shouldTriggerTermsModal(isRootPage) {
    return !isRootPage && !hasAgreedToTerms()
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
