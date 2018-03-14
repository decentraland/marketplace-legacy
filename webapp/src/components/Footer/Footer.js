import React from 'react'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import Icon from 'components/Icon'
import { t } from 'modules/translation/utils'

import './Footer.css'

export default class Footer extends React.PureComponent {
  render() {
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
        <div className="copyright">{t('footer.copyright')}</div>
      </footer>
    )
  }
}
