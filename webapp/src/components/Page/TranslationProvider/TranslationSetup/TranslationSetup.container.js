import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { initTranslations } from 'modules/translation/actions'
import TranslationSetup from './TranslationSetup'

const mapState = state => ({})

const mapDispatch = dispatch => ({
  initTranslations: intl => dispatch(initTranslations(intl))
})

export default injectIntl(connect(mapState, mapDispatch)(TranslationSetup))
