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
            <Link to="https://blog.decentraland.org" target="_blank">
              {t('global.blog')}
            </Link>
            <Link to="https://decentraland.org" target="_blank">
              {t('global.website')}
            </Link>
            <Link to={locations.colorKey}>{t('footer.color_key')}</Link>
            <Link to={locations.privacy}>{t('footer.privacy_policy')}</Link>
            <Link to={locations.terms}>{t('footer.terms')}</Link>
          </div>
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
        </div>
        <div className="footer-column right">
          <span>
            <span className="copyright">{t('footer.copyright')}</span>
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
