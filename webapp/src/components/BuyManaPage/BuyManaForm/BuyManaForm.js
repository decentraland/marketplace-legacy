import React from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Input, Icon } from 'semantic-ui-react'
import TxStatus from 'components/TxStatus'
import { preventDefault, formatMana } from 'lib/utils'
import { t, t_html } from 'modules/translation/utils'
import {
  fetchTransaction,
  fetchManaRate,
  fetchManaDefaultRate,
  getSlippage
} from './utils'

import './BuyManaForm.css'

const FETCH_PRICE_INTERVAL = 10 * 1000

export default class BuyManaForm extends React.PureComponent {
  static propTypes = {
    address: PropTypes.string,
    balance: PropTypes.number,
    isTxIdle: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.interval = null
    this.state = {
      amount: '',
      defaultRate: null,
      rate: null,
      loading: false
    }
  }

  componentDidMount() {
    this.fetchDefaultRate()
    this.clearInterval()
    this.interval = setInterval(
      () => this.fetchDefaultRate(),
      FETCH_PRICE_INTERVAL
    )
  }

  componentWillUnmount() {
    this.clearInterval()
  }

  async fetchRate(amount) {
    this.setState({ loading: true })
    const rate = await fetchManaRate(amount)
    this.setState({ rate, loading: false })
    return rate
  }

  async fetchDefaultRate(amount) {
    const defaultRate = await fetchManaDefaultRate()
    this.setState({ defaultRate })
    return defaultRate
  }

  clearInterval() {
    if (this.interval) {
      clearInterval(this.interval)
    }
    this.interval = null
  }

  handleAmountChange = async e => {
    const amount = e.currentTarget.value
    if (amount === '') {
      this.setState({ amount })
    } else {
      const safeAmount = Math.max(amount, 0)
      this.setState({ amount: safeAmount })
      this.fetchRate(safeAmount)
    }
  }

  handleSubmit = async () => {
    const { amount, loading } = this.state
    if (loading) {
      return
    }
    const { address, onSubmit } = this.props
    this.setState({ loading: true })
    const tx = await fetchTransaction({
      ethAmount: this.getPrice(),
      manaAmount: amount,
      address: address
    })
    this.setState({ loading: false })
    onSubmit(amount, tx)
  }

  getMaxMana() {
    const { balance } = this.props
    const { rate } = this.state
    return balance / rate
  }

  getSlippage() {
    const { defaultRate, rate } = this.state
    return (getSlippage(defaultRate, rate) * 100).toFixed(2)
  }

  getPrice() {
    const { rate, amount } = this.state
    return rate * amount
  }

  isValidTransaction() {
    const { defaultRate, rate } = this.state
    const price = this.getPrice()
    const slippage = getSlippage(defaultRate, rate)
    // sometimes when you hit bancor with a big ass amount it goes cray-cray
    return !isNaN(price) && !isNaN(slippage) && slippage !== Infinity
  }

  isDisabled() {
    const { amount, loading } = this.state
    const { balance } = this.props
    const price = this.getPrice()
    return !this.isValidTransaction() || price > balance || !amount || loading
  }

  render() {
    const { balance, isTxIdle, onCancel } = this.props
    const { amount, rate } = this.state
    const price = this.getPrice()

    return (
      <Form
        className="BuyManaForm"
        onSubmit={preventDefault(this.handleSubmit)}
      >
        <Form.Field>
          <label>{t('buy_mana.receive')}</label>
          <Input
            id="amount-input"
            className="amount-input"
            type="number"
            placeholder="1,000 MANA"
            value={amount}
            onChange={this.handleAmountChange}
            autoComplete="off"
            autoFocus={true}
          />
          {price > balance ? (
            <label className="warning">
              <Icon name="warning sign" />
              {t('buy_mana.not_enough')}
            </label>
          ) : null}
        </Form.Field>
        <br />
        {this.isValidTransaction() ? (
          <React.Fragment>
            <Form.Field>
              <label>{t('buy_mana.pay_with')}</label>
              <Input
                id="pay-with-input"
                className="pay-with-input"
                type="text"
                placeholder="1,000 MANA"
                value={`${this.getPrice()} ETH`}
                disabled
              />
            </Form.Field>
            <br />
            <span className="info">
              {t('buy_mana.rate')}: {formatMana(1 / (this.state.rate || 1))} = 1
              ETH
            </span>
            <span className="info">
              {t('buy_mana.slippage')}&nbsp;<a
                href="https://support.bancor.network/hc/en-us/articles/360000954391-What-is-Price-Slippage-"
                target="_blank"
                rel="noopener noreferrer"
                title="What is Price Slippage?"
                className="price-slippage-help"
              >
                <Icon name="help circle" />
              </a>: {this.getSlippage()}%
            </span>
            <br />
          </React.Fragment>
        ) : amount > 0 && rate != null ? (
          <React.Fragment>
            <label className="warning">{t('buy_mana.amount_too_big')}</label>
            <br />
          </React.Fragment>
        ) : null}
        <span className="info">
          {t_html('buy_mana.powered_by', {
            bancor_link: (
              <a
                href="https://bancor.network"
                target="_blank"
                rel="noopener noreferrer"
                className="external-link"
              >
                Bancor Network
              </a>
            )
          })}
        </span>
        <br />
        <TxStatus.Idle isIdle={isTxIdle} />
        <br />
        <div className="footer">
          <Button type="button" onClick={onCancel}>
            {t('global.cancel')}
          </Button>

          <Button type="submit" primary={true} disabled={this.isDisabled()}>
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
