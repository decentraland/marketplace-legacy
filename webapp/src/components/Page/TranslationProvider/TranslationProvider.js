import React from 'react'
import PropTypes from 'prop-types'

import { Loader } from 'semantic-ui-react'
import { IntlProvider } from 'react-intl'
import TranslationSetup from './TranslationSetup'

export default class TranslationProvider extends React.PureComponent {
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
    const { locale, onFetchTranslations } = nextProps

    if (this.props.locale !== locale) {
      // TODO: Re-fetch even on local-storage
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
    const { children, locale, translations } = this.props

    console.log(translations)

    return translations ? (
      <IntlProvider locale={locale} messages={translations}>
        <React.Fragment>
          <TranslationSetup />
          {children}
        </React.Fragment>
      </IntlProvider>
    ) : (
      this.renderLoading()
    )
  }
}
