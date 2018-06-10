import React from 'react'
import PropTypes from 'prop-types'
import addDays from 'date-fns/add_days'
import differenceInDays from 'date-fns/difference_in_days'
import { Form, Button, Input, Message, Grid } from 'semantic-ui-react'

import TxStatus from 'components/TxStatus'
import AddressBlock from 'components/AddressBlock'
import { parcelType, publicationType } from 'components/types'
import { preventDefault, formatDate } from 'lib/utils'
import { t } from 'modules/translation/utils'
import { getKyberOracleAddress } from 'modules/wallet/utils'

import './MortgageForm.css'

const DEFAULT_DAY_INTERVAL = 31
const MINIMUM_DAY_INTERVAL = 1
const MAXIMUM_DAY_INTERVAL = 5 * 365
const MINIMUM_MORTGAGE_AMOUNT = 1
const MINIMUM_DURATION_DAYS = 30
const MINIMUM_PAYABLE_DAYS = 0
const MAXIMUM_INTEREST_RATE = 100
const MINIMUM_INTEREST_RATE = 1

const INPUT_FORMAT = 'YYYY-MM-DD'

export default class MortgageForm extends React.PureComponent {
  static propTypes = {
    publication: publicationType,
    parcel: parcelType,
    error: PropTypes.string,
    isTxIdle: PropTypes.bool,
    onPublish: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  static defaultProps = {
    publication: {}
  }

  constructor(props) {
    super(props)

    this.state = {
      amount: '',
      duration: '',
      payableAt: '',
      expiresAt: this.formatFutureDate(DEFAULT_DAY_INTERVAL),
      interestRate: 0,
      punitoryRate: 0,
      formErrors: []
    }
  }

  handleChangeNumber = (e, key) => {
    this.setState({
      [key]: e.currentTarget.value ? parseInt(e.currentTarget.value, 10) : '',
      formErrors: []
    })
  }

  handleChangeDate = (e, key) => {
    this.setState({
      [key]: e.currentTarget.value,
      formErrors: []
    })
  }

  handleClearFormErrors = () => {
    this.setState({ formErrors: [] })
  }

  handlePublish = () => {
    const { parcel, publication, onPublish } = this.props
    const {
      amount,
      duration,
      payableAt,
      expiresAt,
      interestRate,
      punitoryRate
    } = this.state

    const formErrors = []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (publication.price <= amount) {
      formErrors.push(t('mortgage.errors.parcel_price'))
    }

    if (amount < MINIMUM_MORTGAGE_AMOUNT) {
      formErrors.push(
        t('mortgage.errors.amount_minimum', {
          amount: MINIMUM_MORTGAGE_AMOUNT
        })
      )
    }

    if (duration < MINIMUM_DURATION_DAYS) {
      formErrors.push(
        t('mortgage.errors.minimum_duration', {
          minimum: MINIMUM_DURATION_DAYS
        })
      )
    }

    if (payableAt < MINIMUM_PAYABLE_DAYS) {
      formErrors.push(
        t('mortgage.errors.minimum_payable', {
          minimum: MINIMUM_PAYABLE_DAYS
        })
      )
    }

    if (
      interestRate < MINIMUM_INTEREST_RATE ||
      punitoryRate < MINIMUM_INTEREST_RATE
    ) {
      formErrors.push(
        t('mortgage.errors.minimum_interest_rate', {
          minimum: MINIMUM_INTEREST_RATE
        })
      )
    }

    if (
      interestRate > MAXIMUM_INTEREST_RATE ||
      punitoryRate > MAXIMUM_INTEREST_RATE
    ) {
      formErrors.push(
        t('mortgage.errors.maximum_interest_rate', {
          maximum: MAXIMUM_INTEREST_RATE
        })
      )
    }

    if (payableAt > duration) {
      formErrors.push(t('mortgage.errors.duration_gte_payable'))
    }

    if (differenceInDays(expiresAt, today) > MAXIMUM_DAY_INTERVAL) {
      formErrors.push(
        t('parcel_publish.errors.maximum_expiration', {
          date: this.formatFutureDate(MAXIMUM_DAY_INTERVAL)
        })
      )
    }

    if (differenceInDays(expiresAt, today) < MINIMUM_DAY_INTERVAL) {
      formErrors.push(
        t('parcel_publish.errors.minimum_expiration', {
          date: this.formatFutureDate(MINIMUM_DAY_INTERVAL + 1)
        })
      )
    }

    if (formErrors.length === 0) {
      onPublish({
        duration: new Date(duration).getTime(),
        payableAt: new Date(payableAt).getTime(),
        expiresAt: new Date(expiresAt).getTime(),
        amount: Number(amount),
        interestRate,
        punitoryRate,
        parcel
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
    const { onCancel, isTxIdle, error } = this.props
    const {
      amount,
      payableAt,
      expiresAt,
      interestRate,
      duration,
      punitoryRate,
      formErrors
    } = this.state

    return (
      <Form
        className="MortgageForm"
        onSubmit={preventDefault(this.handlePublish)}
        error={!!formErrors}
      >
        <Form.Field>
          <label>{t('mortgage.oracle')}</label>
          <p className="address-input">{'MANA <> BANCOR'}</p>
          <AddressBlock
            hasLink={false}
            isUser={false}
            scale={6}
            address={getKyberOracleAddress()}
            hasTooltip={false}
          />
        </Form.Field>
        <Grid divided={'vertically'} className="MortgageFormGrid">
          <Grid.Row columns={3}>
            <Grid.Column mobile={16} computer={5}>
              <Form.Field>
                <label>{t('mortgage.amount')}</label>
                <Input
                  type="number"
                  placeholder={t('mortgage.amount_placeholder')}
                  value={amount}
                  required={true}
                  onChange={e => this.handleChangeNumber(e, 'amount')}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column mobile={16} computer={5}>
              <Form.Field>
                <label>{t('mortgage.duration')}</label>
                <Input
                  type="number"
                  placeholder={t('mortgage.duration_placeholder')}
                  value={duration}
                  required={true}
                  onChange={e => this.handleChangeNumber(e, 'duration')}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column mobile={16} computer={5}>
              <Form.Field>
                <label>{t('mortgage.payable')}</label>
                <Input
                  type="number"
                  placeholder={t('mortgage.payable_placeholder')}
                  value={payableAt}
                  required={true}
                  onChange={e => this.handleChangeNumber(e, 'payableAt')}
                />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={3}>
            <Grid.Column mobile={16} computer={5}>
              <Form.Field>
                <label>{t('mortgage.interest_rate')}</label>
                <Input
                  type="number"
                  placeholder={t('mortgage.interest_rate_placeholder')}
                  value={interestRate}
                  required={true}
                  onChange={e => this.handleChangeNumber(e, 'interestRate')}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column mobile={16} computer={5}>
              <Form.Field>
                <label>{t('mortgage.punitory_rate')}</label>
                <Input
                  type="number"
                  placeholder={t('mortgage.punitory_rate_placeholder')}
                  value={punitoryRate}
                  required={true}
                  onChange={e => this.handleChangeNumber(e, 'punitoryRate')}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column mobile={16} computer={5}>
              <Form.Field>
                <label>{t('mortgage.expiration')}</label>
                <Input
                  type="date"
                  placeholder={t('mortgage.expiration_placeholder')}
                  value={expiresAt}
                  required={true}
                  onChange={e => this.handleChangeDate(e, 'expiresAt')}
                />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <TxStatus.Idle isIdle={isTxIdle} />
        {formErrors.length > 0 ? (
          <Message error onDismiss={this.handleClearFormErrors}>
            {formErrors.map((error, index) => <div key={index}>{error}</div>)}
          </Message>
        ) : null}
        {error && <Message error>{<div>{error}</div>}</Message>}
        <br />
        <div>
          <Button onClick={onCancel} type="button">
            {t('global.cancel')}
          </Button>
          <Button type="submit" primary={true} disabled={isTxIdle}>
            {t('global.request')}
          </Button>
        </div>
      </Form>
    )
  }
}
