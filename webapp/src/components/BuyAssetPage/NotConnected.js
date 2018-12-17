import React from 'react'
import { Container } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import SignInNotice from 'components/SignInNotice'

export const NotConnected = ({ assetType }) => (
  <div>
    <Container text textAlign="center" className="NotConnected">
      <SignInNotice
        title={t('asset_buy.buy_asset', { asset_type: assetType })}
      />
    </Container>
  </div>
)
