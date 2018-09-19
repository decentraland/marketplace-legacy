import { connect } from 'react-redux'
import { isLoading } from '@dapps/modules/storage/selectors'
import { getLocale } from 'modules/wallet/selectors'
import { getData } from 'modules/translation/selectors'
import { fetchTranslationsRequest } from 'modules/translation/actions'
import { getPreferredLocale } from 'modules/translation/utils'

import TranslationProvider from './TranslationProvider'

const mapState = state => {
  // Wait until the locale is loaded from the storage to select it
  let locale = isLoading(state)
    ? null
    : getLocale(state) || getPreferredLocale()

  const translations = getData(state)[locale]

  return {
    locale,
    translations
  }
}

const mapDispatch = dispatch => ({
  onFetchTranslations: locale => dispatch(fetchTranslationsRequest(locale))
})

export default connect(mapState, mapDispatch)(TranslationProvider)
