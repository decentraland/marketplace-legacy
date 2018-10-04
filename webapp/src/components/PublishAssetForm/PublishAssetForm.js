import React from 'react'
import PropTypes from 'prop-types'
import addDays from 'date-fns/add_days'
import differenceInDays from 'date-fns/difference_in_days'
import { Form, Button, Input, Message } from 'semantic-ui-react'

import TxStatus from 'components/TxStatus'
import { assetType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import { preventDefault, formatDate, formatMana } from 'lib/utils'

// TODO: Shouldn't this live on the publication module?
const DEFAULT_DAY_INTERVAL = 31
const MINIMUM_DAY_INTERVAL = 1
const MAXIMUM_DAY_INTERVAL = 5 * 365
const MINIMUM_LAND_PRICE = 1

const INPUT_FORMAT = 'YYYY-MM-DD'

export default class PublishAssetForm extends React.PureComponent {
  static propTypes = {
    asset: assetType,
    assetName: PropTypes.string,
    isTxIdle: PropTypes.bool,
    isDisabled: PropTypes.bool,
    onPublish: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      price: '',
      expiresAt: this.formatFutureDate(DEFAULT_DAY_INTERVAL),
      formErrors: []
    }
  }

  handlePriceChange = e => {
    // Dots and commas are not allowed
    const price = e.currentTarget.value.replace(/\.|,/g, '')

    this.setState({
      price,
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
    const { asset, onPublish } = this.props
    const { price, expiresAt } = this.state

    const formErrors = []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (differenceInDays(expiresAt, today) < MINIMUM_DAY_INTERVAL) {
      formErrors.push(
        t('asset_publish.errors.minimum_expiration', {
          date: this.formatFutureDate(MINIMUM_DAY_INTERVAL + 1)
        })
      )
    }

    if (differenceInDays(expiresAt, today) > MAXIMUM_DAY_INTERVAL) {
      formErrors.push(
        t('asset_publish.errors.maximum_expiration', {
          date: this.formatFutureDate(MAXIMUM_DAY_INTERVAL)
        })
      )
    }

    if (price < MINIMUM_LAND_PRICE) {
      formErrors.push(
        t('asset_publish.errors.minimum_land_price', {
          value: formatMana(MINIMUM_LAND_PRICE, '')
        })
      )
    }

    if (price > Number.MAX_SAFE_INTEGER) {
      formErrors.push(
        t('asset_publish.errors.maximum_land_price', {
          value: formatMana(Number.MAX_SAFE_INTEGER, '')
        })
      )
    }

    if (formErrors.length === 0) {
      onPublish({
        asset_id: asset.id,
        expires_at: new Date(expiresAt).getTime(),
        price: parseFloat(price)
      })
    } else {
      this.setState({ formErrors })
    }
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
        className="PublicationForm"
        onSubmit={preventDefault(this.handlePublish)}
        error={!!formErrors}
      >
        <Form.Field>
          <label>{t('asset_publish.price')}</label>
          <Input
            type="number"
            placeholder={t('asset_publish.price_placeholder', {
              asset_name: assetName
            })}
            value={price}
            required={true}
            onChange={this.handlePriceChange}
          />
        </Form.Field>
        <Form.Field>
          <label>{t('asset_publish.expiration')}</label>
          <Input
            type="date"
            placeholder={t('asset_publish.expiration_placeholder')}
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
