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

  constructor(props) {
    super(props)
    this.completedFirstFetch = false
  }

  componentWillMount() {
    addAvailableLocaleData()
  }

  componentWillReceiveProps(nextProps) {
    const { locale } = nextProps

    if (!this.completedFirstFetch || this.props.locale !== locale) {
      this.props.onFetchTranslations(locale)
      this.completedFirstFetch = true
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
