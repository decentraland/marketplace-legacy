import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { setI18n } from 'modules/translation/utils'
import TranslationSetup from './TranslationSetup'

const mapState = state => ({})

const mapDispatch = dispatch => ({
  setI18n: intl => setI18n(intl)
})

export default injectIntl(connect(mapState, mapDispatch)(TranslationSetup))
