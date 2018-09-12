import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import Icon from 'components/Icon'
import LocalesDropdown from './LocalesDropdown'
import { t } from 'modules/translation/utils'

import './Footer.css'

export default class Footer extends React.PureComponent {
  static propTypes = {
    locale: PropTypes.string,
    onChangeLocale: PropTypes.func
  }

  handleLocaleChange = newLocale => {
    const { locale, onChangeLocale } = this.props

    if (newLocale !== locale) {
      onChangeLocale(newLocale)
    }
  }

  render() {
    const { locale } = this.props

    return (
      <footer className="Footer">
        <div className="footer-column left">
          <div className="links">
            <a
              href="https://blog.decentraland.org"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('global.blog')}
            </a>
            <a
              href="https://decentraland.org"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('global.website')}
            </a>
            <a
              href="https://docs.decentraland.org"
              rel="noopener noreferrer"
              target="_blank"
            >
              FAQ
            </a>
            <Link to={locations.colorKey()}>{t('footer.color_key')}</Link>
            <Link to={locations.privacy()}>{t('footer.privacy_policy')}</Link>
            <Link to={locations.terms()}>{t('footer.terms')}</Link>
          </div>
          <div className="social-icons">
            <a
              href="https://twitter.com/decentraland/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="twitter" />
            </a>
            <a
              href="https://chat.decentraland.org/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="rocketchat" />
            </a>
            <a
              href="https://github.com/decentraland/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="github" />
            </a>
            <a
              href="https://reddit.com/r/decentraland/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="reddit" />
            </a>
            <a
              href="https://www.facebook.com/decentraland/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="facebook" />
            </a>
          </div>
        </div>
        <div className="footer-column right">
          <span>
            <span className="copyright">{t('footer.copyright')}</span>
            <span className="mini-copyright">{t('footer.mini_copyright')}</span>
            <LocalesDropdown
              defaultValue={locale}
              onChange={this.handleLocaleChange}
              className="language-dropdown"
            />
          </span>
        </div>
      </footer>
    )
  }
}
