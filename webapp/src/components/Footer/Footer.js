import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import Icon from 'components/Icon'
import LocaleLink from './LocaleLink'
import { t, getAvailableLocales } from 'modules/translation/utils'

import './Footer.css'

export default class Footer extends React.PureComponent {
  static propTypes = {
    locale: PropTypes.string,
    onFetchTranslations: PropTypes.func
  }

  handleLocaleChange = newLocale => {
    const { locale, onFetchTranslations } = this.props

    if (newLocale !== locale) {
      onFetchTranslations(newLocale)
    }
  }

  render() {
    const currentLocale = this.props.locale

    return (
      <footer className="Footer">
        <div className="social-icons">
          <Link to="https://twitter.com/decentraland/" target="_blank">
            <Icon name="twitter" />
          </Link>
          <Link to="https://chat.decentraland.org/" target="_blank">
            <Icon name="rocketchat" />
          </Link>
          <Link to="https://github.com/decentraland/" target="_blank">
            <Icon name="github" />
          </Link>
          <Link to="https://reddit.com/r/decentraland/" target="_blank">
            <Icon name="reddit" />
          </Link>
          <Link to="https://www.facebook.com/decentraland/" target="_blank">
            <Icon name="facebook" />
          </Link>
        </div>
        <div className="links">
          <Link to="https://blog.decentraland.org" target="_blank">
            {t('global.blog')}
          </Link>
          <Link to="https://decentraland.org" target="_blank">
            {t('global.website')}
          </Link>
          <Link to={locations.colorKey}>{t('footer.color_key')}</Link>
          <Link to={locations.privacy}>{t('footer.privacy_policy')}</Link>
        </div>
        <div className="links">
          <span className="language">Language:</span>
          {getAvailableLocales().map(locale => (
            <LocaleLink
              key={locale}
              locale={locale}
              isActive={locale === currentLocale}
              onClick={this.handleLocaleChange}
            />
          ))}
        </div>
        <div className="copyright">{t('footer.copyright')}</div>
      </footer>
    )
  }
}
