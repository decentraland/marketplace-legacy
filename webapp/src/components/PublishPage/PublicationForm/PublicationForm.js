import React from 'react'
import PropTypes from 'prop-types'
import { txUtils } from 'decentraland-eth'
import addDays from 'date-fns/add_days'
import differenceInDays from 'date-fns/difference_in_days'

import { Form, Button, Input, Message, Icon } from 'semantic-ui-react'
import TxStatus from 'components/TxStatus'

import { parcelType, publicationType } from 'components/types'
import { preventDefault, formatDate, formatMana } from 'lib/utils'
import { t } from 'modules/translation/utils'

import './PublicationForm.css'

// TODO: Shouldn't this live on the publication module?
const DEFAULT_DAY_INTERVAL = 31
const MINIMUM_DAY_INTERVAL = 1
const MAXIMUM_DAY_INTERVAL = 5 * 365
const MINIMUM_LAND_PRICE = 1

const INPUT_FORMAT = 'YYYY-MM-DD'

export default class PublicationForm extends React.PureComponent {
  static propTypes = {
    publication: publicationType,
    parcel: parcelType,
    isTxIdle: PropTypes.bool,
    isDisabled: PropTypes.bool,
    onPublish: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  static defaultProps = {
    publication: {}
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
    this.setState({
      price: e.currentTarget.value,
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
    const { parcel, onPublish } = this.props
    const { price, expiresAt } = this.state

    const formErrors = []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (differenceInDays(expiresAt, today) < MINIMUM_DAY_INTERVAL) {
      formErrors.push(
        t('parcel_publish.errors.minimum_expiration', {
          date: this.formatFutureDate(MINIMUM_DAY_INTERVAL + 1)
        })
      )
    }

    if (differenceInDays(expiresAt, today) > MAXIMUM_DAY_INTERVAL) {
      formErrors.push(
        t('parcel_publish.errors.maximum_expiration', {
          date: this.formatFutureDate(MAXIMUM_DAY_INTERVAL)
        })
      )
    }

    if (price <= MINIMUM_LAND_PRICE) {
      formErrors.push(
        t('parcel_publish.errors.minimum_land_price', {
          value: formatMana(MINIMUM_LAND_PRICE, '')
        })
      )
    }

    if (price >= Number.MAX_SAFE_INTEGER) {
      formErrors.push(
        t('parcel_publish.errors.maximum_land_price', {
          value: formatMana(Number.MAX_SAFE_INTEGER, '')
        })
      )
    }

    if (formErrors.length === 0) {
      onPublish({
        x: parcel.x,
        y: parcel.y,
        expires_at: new Date(expiresAt).getTime(),
        price: parseFloat(price, 10)
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
    const { publication, isTxIdle, isDisabled, onCancel } = this.props
    const { price, expiresAt, formErrors } = this.state

    const isPending =
      publication.tx_status === txUtils.TRANSACTION_STATUS.pending

    return (
      <Form
        className="PublicationForm"
        onSubmit={preventDefault(this.handlePublish)}
        error={!!formErrors}
      >
        <Form.Field>
          <label>{t('parcel_publish.price')}</label>
          <Input
            type="number"
            placeholder={t('parcel_publish.price_placeholder')}
            value={price}
            required={true}
            onChange={this.handlePriceChange}
          />
        </Form.Field>
        <Form.Field>
          <label>{t('parcel_publish.expiration')}</label>
          <Input
            type="date"
            placeholder={t('parcel_publish.expiration_placeholder')}
            value={expiresAt}
            required={true}
            onChange={this.handleExpiresAtChange}
          />
        </Form.Field>
        <TxStatus.Idle isIdle={isTxIdle} />
        {isPending ? (
          <Message icon>
            <Icon name="circle notched" loading />
            <Message.Content>
              <TxStatus.Text
                txHash={publication.tx_hash}
                txStatus={publication.tx_status}
              />
            </Message.Content>
          </Message>
        ) : null}
        {formErrors.length > 0 ? (
          <Message error onDismiss={this.handleClearFormErrors}>
            {formErrors.map((error, index) => <div key={index}>{error}</div>)}
          </Message>
        ) : null}
        <br />
        <div>
          <Button disabled={isPending} onClick={onCancel} type="button">
            {t('global.cancel')}
          </Button>
          <Button
            type="submit"
            primary={true}
            disabled={isPending || isTxIdle || isDisabled}
          >
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
