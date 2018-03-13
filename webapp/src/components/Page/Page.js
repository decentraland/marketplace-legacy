import React from 'react'
import PropTypes from 'prop-types'

import { Loader } from 'semantic-ui-react'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'

import './Page.css'

export default class Page extends React.PureComponent {
  static propTypes = {
    locale: PropTypes.string,
    translations: PropTypes.object,
    children: PropTypes.node.isRequired,
    onFetchTranslations: PropTypes.func
  }

  static defaultProps = {
    children: null
  }

  componentWillReceiveProps(nextProps) {
    const { locale, translations, onFetchTranslations } = nextProps

    if (locale && !translations) {
      onFetchTranslations(locale)
    }
  }

  renderLoading() {
    return (
      <div>
        <Loader active size="massive" />
      </div>
    )
  }

  render() {
    const { children, translations } = this.props

    return (
      <React.Fragment>
        <Navbar />
        <div className="Page">
          {translations ? children : this.renderLoading()}
          <Footer />
        </div>
      </React.Fragment>
    )
  }
}
