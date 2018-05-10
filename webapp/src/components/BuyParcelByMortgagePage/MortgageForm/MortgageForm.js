import React from 'react'
import PropTypes from 'prop-types'
import { txUtils } from 'decentraland-eth'
import addDays from 'date-fns/add_days'
import differenceInDays from 'date-fns/difference_in_days'

import { Form, Button, Input, Message, Icon, Grid } from 'semantic-ui-react'
import ManaIcon from '../../Mana/Icon'
import TxStatus from 'components/TxStatus'

import AddressBlock from 'components/AddressBlock'
import { parcelType, publicationType } from 'components/types'
import { preventDefault, formatDate, formatMana } from 'lib/utils'
import { t } from 'modules/translation/utils'
import { getKyberOracleAddress } from 'modules/wallet/utils'

import './MortgageForm.css'

// TODO: Shouldn't this live on the publication module?
const DEFAULT_DAY_INTERVAL = 31
const MINIMUM_DAY_INTERVAL = 1
const MAXIMUM_DAY_INTERVAL = 5 * 365
const MINIMUM_LAND_PRICE = 1

const INPUT_FORMAT = 'YYYY-MM-DD'

export default class MortgageForm extends React.PureComponent {
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
      amount: 0,
      duration: this.formatFutureDate(DEFAULT_DAY_INTERVAL),
      payableAt: this.formatFutureDate(DEFAULT_DAY_INTERVAL),
      expiresAt: this.formatFutureDate(DEFAULT_DAY_INTERVAL),
      interestRate: 0,
      punitoryRate: 0,
      formErrors: []
    }
  }

  handleDateChange = (e, key) => {
    this.setState({
      [key]: e.currentTarget.value,
      formErrors: []
    })
  }

  handleClearFormErrors = () => {
    this.setState({ formErrors: [] })
  }

  handleAmountChange = e => {
    this.setState({
      amount: e.currentTarget.value,
      formErrors: []
    })
  }

  handlePublish = () => {
    const { parcel, onPublish } = this.props
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

    if (formErrors.length === 0) {
      onPublish({
        duration: new Date(duration).getTime(),
        payableAt: new Date(payableAt).getTime(),
        expiresAt: new Date(expiresAt).getTime(),
        amount,
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
    const { publication, isTxIdle, isDisabled, onCancel } = this.props
    const {
      amount,
      payableAt,
      expiresAt,
      interestRate,
      duration,
      punitoryRate,
      formErrors
    } = this.state

    const isPending =
      publication.tx_status === txUtils.TRANSACTION_STATUS.pending

    return (
      <Form
        className="MortgageForm"
        onSubmit={preventDefault(this.handlePublish)}
        error={!!formErrors}
      >
        <Form.Field>
          <label>{t('mortgage.oracle')}</label>
          <input
            id="address-input"
            className="address-input"
            type="text"
            value={getKyberOracleAddress()}
            readOnly={true}
          />
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
                  placeholder={t('parcel_publish.price_placeholder')}
                  value={amount}
                  required={true}
                  onChange={this.handleAmountChange}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column mobile={16} computer={5}>
              <Form.Field>
                <label>{t('mortgage.duration')}</label>
                <Input
                  type="date"
                  placeholder={t('mortgage.duration_placeholder')}
                  value={duration}
                  required={true}
                  onChange={e => this.handleDateChange(e, 'duration')}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column mobile={16} computer={5}>
              <Form.Field>
                <label>{t('mortgage.payable')}</label>
                <Input
                  type="date"
                  placeholder={t('mortgage.payable_placeholder')}
                  value={payableAt}
                  required={true}
                  onChange={e => this.handleDateChange(e, 'payableAt')}
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
                  onChange={e =>
                    this.setState({ interestRate: e.target.value })
                  }
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
                  onChange={e =>
                    this.setState({ punitoryRate: e.target.value })
                  }
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
                  onChange={e => this.handleDateChange(e, 'expiresAt')}
                />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
            {t('global.request')}
          </Button>
        </div>
      </Form>
    )
  }
}
