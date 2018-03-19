import React from 'react'
import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'

export default class TranslationProvider extends React.PureComponent {
  static propTypes = {
    intl: intlShape,
    initTranslations: PropTypes.func
  }

  componentWillMount() {
    this.props.initTranslations(this.props.intl)
  }

  componentWillReceiveProps(nextProps) {
    const { intl } = nextProps
    if (intl) {
      this.props.initTranslations(intl)
    }
  }

  render() {
    return null
  }
}
