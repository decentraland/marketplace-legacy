import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Header } from 'semantic-ui-react'
import { t, T } from '@dapps/modules/translation/utils'

import { locations } from 'locations'
import './BuyAssetPage.css'

export const NotConnected = ({ assetType }) => (
  <div>
    <Container text textAlign="center" className="BuyAssetPage">
      <Header as="h2" size="huge" className="title">
        {t('asset_buy.buy_asset', { asset_type: assetType })}
      </Header>
      <p className="sign-in">
        <T
          id="global.sign_in_notice"
          values={{
            sign_in_link: (
              <Link to={locations.signIn()}>{t('global.sign_in')}</Link>
            )
          }}
        />
      </p>
    </Container>
  </div>
)
