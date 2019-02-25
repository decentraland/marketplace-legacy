import React from 'react'
import PropTypes from 'prop-types'
import addDays from 'date-fns/add_days'
import dateFnsFormat from 'date-fns/format'
import differenceInDays from 'date-fns/difference_in_days'
import { Form, Button, Input, Message } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { assetType, bidType } from 'components/types'
import {
  preventDefault,
  formatDate,
  formatMana,
  sanitizePrice
} from 'lib/utils'
import { isParcel } from 'shared/parcel'
import {
  DEFAULT_DAY_INTERVAL,
  MINIMUM_DAY_INTERVAL,
  MAXIMUM_BID_DAY_INTERVAL,
  MINIMUM_ASSET_PRICE
} from 'shared/listing'
import TxStatus from 'components/TxStatus'

import './BidAssetForm.css'

const INPUT_FORMAT = 'YYYY-MM-DD'

export default class BidAssetForm extends React.PureComponent {
  static propTypes = {
    asset: assetType,
    assetName: PropTypes.string,
    bid: bidType,
    isTxIdle: PropTypes.bool,
    isDisabled: PropTypes.bool,
    onBid: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    balance: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props)
    const { bid } = props

    this.state = {
      price: bid ? bid.price : '',
      expiresAt: bid
        ? dateFnsFormat(parseInt(bid.expires_at, 10), INPUT_FORMAT)
        : this.formatFutureDate(DEFAULT_DAY_INTERVAL),
      formErrors: []
    }
  }

  handlePriceChange = e => {
    const { balance } = this.props
    // Dots and commas are not allowed
    const price = sanitizePrice(e.currentTarget.value)

    this.setState({
      price: price > balance ? Math.floor(balance) : price,
      formErrors: []
    })
  }

  handleExpiresAtChange = e => {
    this.setState({
      expiresAt: e.currentTarget.value,
      formErrors: []
    })
  }

  handleClearFormErrors = () => {
    this.setState({ formErrors: [] })
  }

  handlePublish = () => {
    const { asset, onBid } = this.props
    const { price, expiresAt } = this.state

    const formErrors = []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (differenceInDays(expiresAt, today) < MINIMUM_DAY_INTERVAL) {
      formErrors.push(
        t('asset_bid.errors.minimum_expiration', {
          date: this.formatFutureDate(MINIMUM_DAY_INTERVAL + 1)
        })
      )
    }

    if (differenceInDays(expiresAt, today) > MAXIMUM_BID_DAY_INTERVAL) {
      formErrors.push(
        t('asset_bid.errors.maximum_expiration', {
          date: this.formatFutureDate(MAXIMUM_BID_DAY_INTERVAL)
        })
      )
    }

    if (price < MINIMUM_ASSET_PRICE) {
      formErrors.push(
        t('asset_bid.errors.minimum_land_price', {
          value: formatMana(MINIMUM_ASSET_PRICE, ''),
          asset_name: isParcel(asset) ? t('name.parcel') : t('name.estate')
        })
      )
    }

    if (price > Number.MAX_SAFE_INTEGER) {
      formErrors.push(
        t('asset_bid.errors.maximum_land_price', {
          value: formatMana(Number.MAX_SAFE_INTEGER, ''),
          asset_name: isParcel(asset) ? t('name.parcel') : t('name.estate')
        })
      )
    }

    if (formErrors.length === 0) {
      onBid({
        asset_id: asset.id,
        expires_at: this.toUTCTimestamp(expiresAt),
        price: parseInt(price)
      })
    } else {
      this.setState({ formErrors })
    }
  }

  toUTCTimestamp(expiresAt) {
    const date = new Date(expiresAt)
    return date.getTime() + date.getTimezoneOffset() * 60000
  }

  formatFutureDate(addedDays, date = new Date()) {
    date = addDays(date, addedDays)
    return formatDate(date, INPUT_FORMAT)
  }

  render() {
    const { isTxIdle, assetName, isDisabled, onCancel } = this.props
    const { price, expiresAt, formErrors } = this.state

    return (
      <Form
        className="BidForm"
        onSubmit={preventDefault(this.handlePublish)}
        error={!!formErrors}
      >
        <Form.Field>
          <label>{t('global.price')}</label>
          <Input
            type="number"
            placeholder={t('asset_bid.price_placeholder', {
              asset_name: assetName
            })}
            value={price}
            required={true}
            onChange={this.handlePriceChange}
          />
        </Form.Field>
        <Form.Field>
          <label>{t('asset_bid.expiration')}</label>
          <Input
            type="date"
            placeholder={t('asset_bid.expiration_placeholder')}
            value={expiresAt}
            required={true}
            onChange={this.handleExpiresAtChange}
          />
        </Form.Field>
        <TxStatus.Idle isIdle={isTxIdle} />
        {formErrors.length > 0 ? (
          <Message error onDismiss={this.handleClearFormErrors}>
            {formErrors.map((error, index) => <div key={index}>{error}</div>)}
          </Message>
        ) : null}
        <div className="modal-buttons">
          <Button onClick={onCancel} type="button">
            {t('global.cancel')}
          </Button>
          <Button
            type="submit"
            primary={true}
            disabled={isTxIdle || isDisabled || price <= 0}
          >
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
