import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import { t, T } from '@dapps/modules/translation/utils'

import Mana from 'components/Mana'
import { mortgageType } from 'components/types'
import TxStatus from 'components/TxStatus'
import { preventDefault, formatMana } from 'lib/utils'

import './PayMortgageForm.css'

const NETWORK_FEE_PERCENTAGE = 1.01

export default class PayMortgageForm extends React.PureComponent {
  static propTypes = {
    mana: PropTypes.number,
    mortgage: mortgageType,
    isTxIdle: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      amount: '',
      formErrors: []
    }
  }

  handleAmountChange = e => {
    const amount = e.target.value ? parseInt(e.target.value, 10) : 0
    this.setState({
      amount: amount > 0 ? amount : '',
      formErrors: []
    })
  }

  handleSubmit = () => {
    const { mortgage, onSubmit, mana } = this.props
    const { loan_id, asset_id } = mortgage
    const { amount } = this.state
    const formErrors = []

    if (mana < amount * NETWORK_FEE_PERCENTAGE) {
      formErrors.push(
        t('mortgage.errors.insufficient_funds', {
          amount: formatMana(amount * NETWORK_FEE_PERCENTAGE)
        })
      )
    }

    if (formErrors.lenght === 0) {
      onSubmit({ loanId: loan_id, assetId: asset_id, amount })
    } else {
      this.setState({ formErrors })
    }
  }

  handleClearFormErrors = () => {
    this.setState({ formErrors: [] })
  }

  render() {
    const { isTxIdle, onCancel, isDisabled } = this.props
    const { amount, formErrors } = this.state

    return (
      <Form
        className="PayMortgageForm"
        onSubmit={preventDefault(this.handleSubmit)}
        error={formErrors.length}
      >
        <Form.Field>
          <label>Amount</label>
          <Input
            id="amount-input"
            className="amount-input"
            type="number"
            placeholder={t('mortgage.amount_placeholder')}
            value={amount}
            onChange={this.handleAmountChange}
            autoFocus={true}
            required={true}
          />
        </Form.Field>
        <br />
        {amount > 0 && (
          <div>
            <p className="network-fee">
              {
                <T
                  id="mortgage.network_fee"
                  values={{
                    amount: (
                      <Mana
                        amount={amount * NETWORK_FEE_PERCENTAGE}
                        size={15}
                        scale={1}
                        className="mortgage-amount-icon"
                      />
                    )
                  }}
                />
              }
            </p>
          </div>
        )}
        <TxStatus.Idle isIdle={isTxIdle} />
        {formErrors.length > 0 ? (
          <Message error onDismiss={this.handleClearFormErrors}>
            {formErrors.map((error, index) => <div key={index}>{error}</div>)}
          </Message>
        ) : null}
        <br />
        <div className="modal-buttons">
          <Button type="button" onClick={onCancel}>
            {t('global.cancel')}
          </Button>

          <Button
            type="submit"
            primary={true}
            disabled={isDisabled || amount <= 0 || formErrors.length > 0}
          >
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
