import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@dapps/modules/translation/utils'

import { getAuctionStartDate } from 'modules/auction/utils'
import Countdown from 'components/Countdown'

import './AuctionCountdown.css'

export default class AuctionCountdown extends React.PureComponent {
  static defaultProps = {
    isBanner: false
  }

  static propTypes = {
    isBanner: PropTypes.bool
  }

  getClass = () => {
    const { isBanner } = this.props
    return isBanner ? 'banner' : ''
  }

  render() {
    return (
      <div className={`AuctionCountdown ${this.getClass()}`}>
        <div>
          <h1 className="title">{t('auction_splash.title')}</h1>
          <div className="description">{t('auction_splash.description')}</div>
        </div>
        <div className="countdown-wrapper">
          <Countdown date={getAuctionStartDate()} />
        </div>
        <div className="actions">{this.props.children}</div>
      </div>
    )
  }
}
