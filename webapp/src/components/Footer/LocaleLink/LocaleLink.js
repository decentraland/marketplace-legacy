import React from 'react'
import PropTypes from 'prop-types'

export default class LocaleLink extends React.PureComponent {
  static propTypes = {
    locale: PropTypes.string,
    active: PropTypes.bool,
    onClick: PropTypes.func
  }

  handleClick = e => {
    const { locale, isActive, onClick } = this.props

    if (!isActive) {
      onClick(locale)
    }
  }

  render() {
    const { locale, isActive } = this.props
    return (
      <span
        className={`LocaleLink link ${isActive ? 'active' : ''}`}
        onClick={this.handleClick}
      >
        {locale}
      </span>
    )
  }
}
