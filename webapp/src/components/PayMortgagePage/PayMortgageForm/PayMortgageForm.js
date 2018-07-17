import React from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Input } from 'semantic-ui-react'
import { preventDefault } from 'lib/utils'
import { t } from 'modules/translation/utils'
import { mortgageType } from 'components/types'
import TxStatus from 'components/TxStatus'
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
    const amount = e.currentTarget.value
    if (amount === '') {
      this.setState({ amount })
    } else {
      this.setState({
        amount: Math.min(balance, amount)
      })
    }
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

          <Button type="submit" primary={true} disabled={isDisabled}>
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
