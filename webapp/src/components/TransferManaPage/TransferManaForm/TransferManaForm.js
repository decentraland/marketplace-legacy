import React from 'react'
import PropTypes from 'prop-types'
import { eth } from 'decentraland-eth'
import { Button, Form, Input } from 'semantic-ui-react'

import TxStatus from 'components/TxStatus'
import AddressInput from 'components/AddressInput'
import { t } from '@dapps/modules/translation/utils'
import { getContractAddress } from 'modules/wallet/utils'
import { preventDefault } from 'lib/utils'

import './TransferManaForm.css'

export default class TransferManaForm extends React.PureComponent {
  static propTypes = {
    address: PropTypes.string,
    balance: PropTypes.number,
    isTxIdle: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      amount: '',
      address: ''
    }
  }

  handleAmountChange = e => {
    const { balance } = this.props
    const amount = e.currentTarget.value
    if (amount === '') {
      this.setState({ amount })
    } else {
      this.setState({ amount: Math.max(Math.min(balance, amount), 0) })
    }
  }

  handleAddressChange = newAddress => {
    const { address } = this.state

    if (address !== newAddress.toLowerCase()) {
      this.setState({ address: newAddress })
    }
  }

  handleSubmit = () => {
    const { onSubmit } = this.props
    const { address, amount } = this.state
    onSubmit({ amount, address: address.trim().toLowerCase() })
  }

  isEmptyAddress() {
    return this.state.address.trim() === ''
  }

  isOwnAddress() {
    return (
      this.state.address.trim().toLowerCase() ===
      this.props.address.trim().toLowerCase()
    )
  }

  isMANATokenAddress() {
    return (
      this.state.address.trim().toLowerCase() ===
      getContractAddress('MANAToken').toLowerCase()
    )
  }

  isDisabled() {
    const { balance } = this.props
    const { amount, address } = this.state

    const isValidAmount = !isNaN(amount) && amount > 0 && amount <= balance
    const isValidAddress =
      !this.isOwnAddress() && eth.utils.isValidAddress(address)

    return !isValidAmount || !isValidAddress
  }

  render() {
    const { isTxIdle, onCancel } = this.props
    const { address, amount } = this.state

    return (
      <Form
        className="TransferManaForm"
        onSubmit={preventDefault(this.handleSubmit)}
      >
        <Form.Field>
          <label>{t('transfer_mana.amount')}</label>
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
        <Form.Field>
          <AddressInput
            label={t('global.recipient_address')}
            placeholder={t('global.address_placeholder')}
            address={address}
            onChange={this.handleAddressChange}
          />
          <span className="transfer-warning">
            {t('transfer_mana.irreversible')}
          </span>
          <br />
          <span className="transfer-warning">{t('global.check_address')}</span>
          {this.isOwnAddress() ? (
            <React.Fragment>
              <br />
              <br />
              <span className="transfer-warning error">
                {t('global.own_address_warning')}
              </span>
            </React.Fragment>
          ) : null}
          {this.isMANATokenAddress() ? (
            <React.Fragment>
              <br />
              <br />
              <span className="transfer-warning error">
                {t('transfer_mana.is_mana_contract_address')}
              </span>
            </React.Fragment>
          ) : null}
        </Form.Field>
        <br />
        <TxStatus.Idle isIdle={isTxIdle} />
        <br />
        <div className="modal-buttons">
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
