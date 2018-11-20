import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'

import { locations } from 'locations'
import { t } from '@dapps/modules/translation/utils'
import LocalesDropdown from './LocalesDropdown'

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
            <a
              href="https://decentraland.org/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('footer.privacy_policy')}
            </a>
            <a
              href="https://decentraland.org/terms"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('footer.terms')}
            </a>
          </div>
          <div className="social-icons">
            <a
              href="https://twitter.com/decentraland/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="twitter" size="normal" />
            </a>
            <a
              href="https://github.com/decentraland/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="github" size="normal" />
            </a>
            <a
              href="https://reddit.com/r/decentraland/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="reddit" size="normal" />
            </a>
            <a
              href="https://www.facebook.com/decentraland/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="facebook" size="normal" />
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
