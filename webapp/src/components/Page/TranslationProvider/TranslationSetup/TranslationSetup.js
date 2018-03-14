import React from 'react'
import { intlShape } from 'react-intl'
import { setupI18n } from 'modules/translation/utils'

export default class TranslationProvider extends React.PureComponent {
  static propTypes = {
    intl: intlShape
  }

  componentWillMount() {
    const { intl } = this.props
    setupI18n(intl)
  }

  render() {
    return null
  }
}
