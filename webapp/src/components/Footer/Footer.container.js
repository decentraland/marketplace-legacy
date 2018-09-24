import { connect } from 'react-redux'
import { changeLocale } from '@dapps/modules/translation/actions'
import { getLocale } from 'modules/wallet/selectors'
import Footer from './Footer'

const mapState = state => {
  return {
    locale: getLocale(state)
  }
}

const mapDispatch = dispatch => ({
  onChangeLocale: locale => dispatch(changeLocale(locale))
})

export default connect(mapState, mapDispatch)(Footer)
