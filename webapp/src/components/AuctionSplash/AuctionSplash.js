import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Form } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'
import { getAnalytics } from '@dapps/modules/analytics/utils'

import { preventDefault } from 'lib/utils'
import {
  hasSeenAuctionHelper,
  dismissAuctionHelper,
  AUCTION_HELPERS
} from 'modules/auction/utils'
import AuctionStaticPage from 'components/AuctionStaticPage'
import AuctionCountdown from 'components/AuctionCountdown'

import './AuctionSplash.css'

export default class AuctionFinishedPage extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  }

  constructor() {
    super()

    this.state = {
      email: '',
      subscribed: false
    }
  }

  onChangeEmail = e => {
    this.setState({
      email: e.target.value
    })
  }

  handleSubmit = () => {
    const analytics = getAnalytics()
    analytics.identify({
      email: this.state.email
    })
    dismissAuctionHelper(AUCTION_HELPERS.SUBSCRIBED_TO_AUCTION_BY_EMAIL)
    this.setState({ subscribed: true })
  }

  renderFooter = () => {
    const { email, subscribed } = this.state

    if (subscribed) {
      return <p className="subscribed">{t('auction_splash.subscribed')}</p>
    }

    if (hasSeenAuctionHelper(AUCTION_HELPERS.SUBSCRIBED_TO_AUCTION_BY_EMAIL)) {
      return (
        <p className="subscribed">{t('auction_splash.already_subscribed')}</p>
      )
    }

    return (
      <React.Fragment>
        <p>{t('auction_splash.cta_title')}</p>
        <Form
          onSubmit={preventDefault(this.handleSubmit)}
          className="cta-wrapper"
        >
          <Input
            type="email"
            value={email}
            onChange={this.onChangeEmail}
            autoFocus
            placeholder={t('global.email')}
            required
          />
          <Button primary={true}>
            {t('auction_splash.cta').toUpperCase()}
          </Button>
        </Form>
      </React.Fragment>
    )
  }

  render() {
    return (
      <AuctionStaticPage>
        <div className="AuctionSplash">
          <AuctionCountdown>{this.renderFooter()}</AuctionCountdown>
        </div>
      </AuctionStaticPage>
    )
  }
}
