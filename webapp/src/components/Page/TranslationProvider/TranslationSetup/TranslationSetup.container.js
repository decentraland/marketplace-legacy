import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import TranslationSetup from './TranslationSetup'

const mapState = state => ({})

const mapDispatch = dispatch => ({})

export default injectIntl(connect(mapState, mapDispatch)(TranslationSetup))
