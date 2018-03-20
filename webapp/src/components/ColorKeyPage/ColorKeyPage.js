import React from 'react'
import { Link } from 'react-router-dom'

import { Button } from 'semantic-ui-react'

import StaticPage from 'components/StaticPage'
import { t } from 'modules/translation/utils'

import { locations } from 'locations'

import './ColorKeyPage.css'

export default function ColorKey() {
  return (
    <StaticPage className="ColorKeyPage">
      <h2>{t('color_key.title')}</h2>

      <div className="message">
        <div className="land-color-keys">
          <div className="land">
            <div className="key my-parcels" />
            <div className="text">{t('color_key.yours')}</div>
          </div>
          <div className="land">
            <div className="key taken" />
            <div className="text">{t('color_key.taken')}</div>
          </div>
          <div className="land">
            <div className="key district" />
            <div className="text">{t('color_key.district')}</div>
          </div>
          <div className="land">
            <div className="key contribution" />
            <div className="text">{t('color_key.contribution')}</div>
          </div>
          <div className="land">
            <div className="key roads" />
            <div className="text">{t('color_key.roads')}</div>
          </div>
          <div className="land">
            <div className="key plaza" />
            <div className="text">{t('color_key.plaza')}</div>
          </div>
          <div className="land">
            <div className="key unowned" />
            <div className="text">{t('color_key.unowned')}</div>
          </div>
          <div className="land">
            <div className="key on-sale" />
            <div className="text">{t('color_key.on_sale')}</div>
          </div>
        </div>
      </div>
      <Link to={locations.parcelMapDetail(0, 0)}>
        <Button>{t('color_key.go_back')}</Button>
      </Link>
    </StaticPage>
  )
}
