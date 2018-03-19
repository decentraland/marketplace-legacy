import React from 'react'
import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'

export default class TranslationProvider extends React.PureComponent {
  static propTypes = {
    intl: intlShape,
    setI18n: PropTypes.func
  }

  componentWillMount() {
    this.props.setI18n(this.props.intl)
  }

  componentWillReceiveProps(nextProps) {
    const { intl } = nextProps
    if (intl) {
      this.props.setI18n(intl)
    }
  }

  render() {
    return null
  }
}
