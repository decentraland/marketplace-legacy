import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@dapps/modules/translation/utils'

import './Countdown.css'

export default class Countdown extends React.PureComponent {
  static propTypes = {
    date: PropTypes.number.isRequired
  }

  static defaultProps = {
    date: new Date()
  }

  constructor(props) {
    super(props)

    this.state = {
      days: '--',
      hours: '--',
      min: '--',
      sec: '--'
    }
  }

  componentDidMount() {
    // update every second
    this.interval = setInterval(() => {
      const timeLeft = this.calculateCountdown(this.props.date)
      timeLeft ? this.setState(timeLeft) : this.stop()
    }, 1000)
  }

  componentWillUnmount() {
    this.stop()
  }

  calculateCountdown(endDate) {
    let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000

    // clear countdown when date is reached
    if (diff <= 0) return false

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0
    }

    // calculate time difference between now and expected date
    if (diff >= 365.25 * 86400) {
      // 365.25 * 24 * 60 * 60
      timeLeft.years = Math.floor(diff / (365.25 * 86400))
      diff -= timeLeft.years * 365.25 * 86400
    }
    if (diff >= 86400) {
      // 24 * 60 * 60
      timeLeft.days = Math.floor(diff / 86400)
      diff -= timeLeft.days * 86400
    }
    if (diff >= 3600) {
      // 60 * 60
      timeLeft.hours = Math.floor(diff / 3600)
      diff -= timeLeft.hours * 3600
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60)
      diff -= timeLeft.min * 60
    }
    timeLeft.sec = diff

    return timeLeft
  }

  stop() {
    clearInterval(this.interval)
  }

  addLeadingZeros(value) {
    value = value.toString()
    while (value.length < 2) {
      value = '0' + value
    }
    return value
  }

  render() {
    const { days, hours, min, sec } = this.state

    return (
      <div className="Countdown">
        <span className="Countdown-col">
          <span className="Countdown-col-element">
            <p>{this.addLeadingZeros(days)}</p>
            <span>{days === 1 ? t('global.day') : t('global.days')}</span>
          </span>
        </span>

        <span className="Countdown-col">
          <span className="Countdown-col-element">
            <p>{this.addLeadingZeros(hours)}</p>
            <span>{t('global.hours')}</span>
          </span>
        </span>

        <span className="Countdown-col">
          <span className="Countdown-col-element dots">
            <p>:</p>
          </span>
        </span>

        <span className="Countdown-col">
          <span className="Countdown-col-element">
            <p>{this.addLeadingZeros(min)}</p>
            <span>{t('global.minutes')}</span>
          </span>
        </span>

        <span className="Countdown-col">
          <span className="Countdown-col-element dots">
            <p>:</p>
          </span>
        </span>

        <span className="Countdown-col">
          <span className="Countdown-col-element">
            <p>{this.addLeadingZeros(sec)}</p>
            <span>{t('global.seconds')}</span>
          </span>
        </span>
      </div>
    )
  }
}
