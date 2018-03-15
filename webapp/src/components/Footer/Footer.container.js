import { connect } from 'react-redux'
import { getLocale } from 'modules/wallet/selectors'
import { fetchTranslationsRequest } from 'modules/translation/actions'
import Footer from './Footer'

const mapState = state => {
  return {
    locale: getLocale(state)
  }
}

const mapDispatch = dispatch => ({
  onFetchTranslations: locale => dispatch(fetchTranslationsRequest(locale))
})

export default connect(mapState, mapDispatch)(Footer)
