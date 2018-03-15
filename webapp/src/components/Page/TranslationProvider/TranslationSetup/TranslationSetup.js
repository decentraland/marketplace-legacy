import React from 'react'
import { intlShape } from 'react-intl'
import { setI18n } from 'modules/translation/utils'

export default class TranslationProvider extends React.PureComponent {
  static propTypes = {
    intl: intlShape
  }

  componentWillMount() {
    setI18n(this.props.intl)
  }

  componentWillReceiveProps(nextProps) {
    const { intl } = nextProps
    if (intl) {
      setI18n(intl)
    }
  }

  render() {
    return null
  }
}
