import React from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Input } from 'semantic-ui-react'
import TxStatus from 'components/TxStatus'
import { preventDefault } from 'lib/utils'
import { t } from 'modules/translation/utils'

import './PayMortgageForm.css'

export default class PayMortgageForm extends React.PureComponent {
  static propTypes = {
    balance: PropTypes.number,
    isTxIdle: PropTypes.bool,
    mortgage: PropTypes.object.isRequired, //TODO: mortgageType
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      amount: ''
    }
  }

  handleAmountChange = e => {
    const { mortgage, balance } = this.props
    const amount = e.currentTarget.value
    if (amount === '') {
      this.setState({ amount })
    } else {
      this.setState({
        amount: Math.max(
          Math.min(mortgage.outstanding_amount, balance, amount),
          0
        )
      })
    }
  }

  handleSubmit = () => {
    const {
      mortgage: { loan_id },
      onSubmit
    } = this.props
    const { amount } = this.state
    onSubmit({ loanId: loan_id, amount })
  }

  render() {
    const { isTxIdle, onCancel } = this.props
    const { amount } = this.state

    return (
      <Form
        className="TransferManaForm"
        onSubmit={preventDefault(this.handleSubmit)}
      >
        <Form.Field>
          <label>Amount</label>
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
        </Form.Field>
        <br />
        <TxStatus.Idle isIdle={isTxIdle} />
        <br />
        <div className="footer">
          <Button type="button" onClick={onCancel}>
            {t('global.cancel')}
          </Button>

          <Button type="submit" primary={true}>
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
