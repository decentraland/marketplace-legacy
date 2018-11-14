import React from 'react'
import { Container, Header } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import SignInNotice from 'components/SignInNotice'

export const NotConnected = ({ assetType }) => (
  <div>
    <Container text textAlign="center" className="NotConnected">
      <Header as="h2" size="huge" className="title">
        {t('asset_buy.buy_asset', { asset_type: assetType })}
      </Header>
      <SignInNotice />
    </Container>
  </div>
)
