import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input } from 'semantic-ui-react'

import { t } from '@dapps/modules/translation/utils'
import { mortgageType } from 'components/types'
import TxStatus from 'components/TxStatus'
import { preventDefault } from 'lib/utils'
import './PayMortgageForm.css'

export default class PayMortgageForm extends React.PureComponent {
  static propTypes = {
    balance: PropTypes.number,
    mortgage: mortgageType,
    isTxIdle: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      amount: ''
    }
  }

  handleAmountChange = e => {
    const { balance } = this.props
    const amount = e.target.value ? parseInt(e.target.value, 10) : 0
    this.setState({
      amount: amount > 0 ? Math.min(balance, amount) : ''
    })
  }

  handleSubmit = () => {
    const { mortgage, onSubmit } = this.props
    const { loan_id, asset_id } = mortgage
    const { amount } = this.state
    onSubmit({ loanId: loan_id, assetId: asset_id, amount })
  }

  render() {
    const { isTxIdle, onCancel, isDisabled } = this.props
    const { amount } = this.state

    return (
      <Form
        className="MortgageForm"
        onSubmit={preventDefault(this.handleSubmit)}
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
        <TxStatus.Idle isIdle={isTxIdle} />
        <br />
        <div className="modal-buttons">
          <Button type="button" onClick={onCancel}>
            {t('global.cancel')}
          </Button>

          <Button
            type="submit"
            primary={true}
            disabled={isDisabled || amount <= 0}
          >
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
