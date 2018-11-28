import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Form } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import AuctionStaticPage from 'components/AuctionStaticPage'
import AuctionCountdown from 'components/AuctionCountdown'

export default class AuctionFinishedPage extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  }

  render() {
    const { onSubmit } = this.props

    return (
      <AuctionStaticPage>
        <div className="AuctionSpash">
          <AuctionCountdown>
            <p>{t('auction_splash.cta_title')}</p>
            <Form onSubmit={onSubmit} className="cta-wrapper">
              <Input
                type="email"
                autoFocus
                placeholder={t('global.email')}
                required
              />
              <Button primary={true}>
                {t('auction_splash.cta').toUpperCase()}
              </Button>
            </Form>
          </AuctionCountdown>
        </div>
      </AuctionStaticPage>
    )
  }
}
