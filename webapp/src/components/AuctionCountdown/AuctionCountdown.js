import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@dapps/modules/translation/utils'

import {
  getAuctionStartDate,
  hasAuctionStarted,
  hasAuctionFinished
} from 'modules/auction/utils'
import Countdown from 'components/Countdown'

import './AuctionCountdown.css'

export default class AuctionCountdown extends React.PureComponent {
  static defaultProps = {
    isBanner: false,
    isConnected: false
  }

  static propTypes = {
    isBanner: PropTypes.bool,
    isConnected: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.interval = null
    this.state = {
      hasFinished: false
    }
  }

  componentDidMount() {
    this.stopInterval()
    if (!hasAuctionStarted()) {
      this.interval = setInterval(() => this.checkStartDate(), 1000)
    }
    this.checkEndDate()
  }

  componentWillUnmount() {
    this.stopInterval()
  }

  componentWillReceiveProps() {
    this.checkEndDate()
  }

  checkStartDate() {
    if (hasAuctionStarted()) {
      window.location.reload()
      this.stopInterval()
    }
  }

  async checkEndDate() {
    if (!this.props.isConnected) return
    const hasFinished = await hasAuctionFinished()
    this.setState({ hasFinished })
  }

  stopInterval() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  getClassName = () => {
    const { isBanner } = this.props
    return isBanner ? 'banner' : ''
  }

  render() {
    const { hasFinished } = this.state
    const hasStarted = hasAuctionStarted()
    let description
    if (hasFinished) {
      description = t('auction.description_after_finish')
    } else if (hasStarted) {
      description = t('auction.description_after_start')
    } else {
      description = t('auction.description_before_start')
    }
    return (
      <div className={`AuctionCountdown ${this.getClassName()}`}>
        <div>
          <h1 className="title">{t('auction.title')}</h1>
          <div className="description">{description}</div>
        </div>
        <div className="countdown-wrapper">
          {hasStarted || hasFinished ? null : (
            <Countdown date={getAuctionStartDate()} />
          )}
        </div>
        <div className="actions">{this.props.children}</div>
      </div>
    )
  }
}
