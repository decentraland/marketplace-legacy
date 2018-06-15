import React from 'react'
import PropTypes from 'prop-types'

import { Loader } from 'semantic-ui-react'
import TranslationSetup from './TranslationSetup'
import { I18nProvider, addAvailableLocaleData } from 'modules/translation/utils'

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

  componentWillMount() {
    const { locale, onFetchTranslations } = this.props
    addAvailableLocaleData()
    if (locale) {
      onFetchTranslations(locale)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { locale, onFetchTranslations } = nextProps

    if (this.props.locale !== locale) {
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

    return translations ? (
      <I18nProvider locale={locale} messages={translations}>
        <React.Fragment>
          <TranslationSetup />
          {children}
        </React.Fragment>
      </I18nProvider>
    ) : (
      this.renderLoading()
    )
  }
}
