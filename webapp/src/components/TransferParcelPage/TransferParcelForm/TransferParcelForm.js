import React from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Input, Message } from 'semantic-ui-react'
import { parcelType } from 'components/types'
import TxStatus from 'components/TxStatus'
import { isTransactionRejectedError } from 'modules/transaction/utils'
import { preventDefault } from 'lib/utils'

import './TransferParcelForm.css'

export default class TransferParcelForm extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    isTxIdle: PropTypes.bool,
    transferError: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCleanTransfer: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      address: ''
    }
  }

  handleAddressChange = e => {
    const { transferError } = this.props
    const { address } = this.state
    const newAddress = e.currentTarget.value

    if (address !== newAddress) {
      if (transferError) this.handleClearFormErrors()
      this.setState({ address: newAddress })
    }
  }

  handleSubmit = () => {
    const { parcel } = this.props
    const newAddress = this.state.address.trim()
    this.props.onSubmit(parcel, newAddress)
  }

  handleClearFormErrors = () => {
    this.props.onCleanTransfer()
  }

  handleCancel = () => {
    this.props.onCancel()
  }

  isEmptyAddress() {
    return this.state.address.trim() === ''
  }

  hasError() {
    const { transferError } = this.props
    return transferError && !isTransactionRejectedError(transferError)
  }

  isExpectedError() {
    return !this.props.transferError.includes('Error: Error:')
  }

  render() {
    const { isTxIdle, transferError } = this.props
    const { address } = this.state
    const inputClassName = `address-input ${
      transferError ? 'address-input-transferError' : ''
    }`

    return (
      <Form
        className="TransferParcelForm"
        onSubmit={preventDefault(this.handleSubmit)}
        error={!!transferError}
      >
        <Form.Field>
          <label>Recipient address</label>
          <Input
            id="address-input"
            className={inputClassName}
            type="text"
            placeholder="Ex: 0x0f5d2fb29fb7d3cfee444a200298f468908cc942"
            value={address}
            onChange={this.handleAddressChange}
            autoComplete="off"
            autoFocus={true}
          />

          {this.hasError() && (
            <Message error onDismiss={this.handleClearFormErrors}>
              {this.isExpectedError() ? (
                <React.Fragment>{transferError}</React.Fragment>
              ) : (
                <React.Fragment>
                  An unknown error occurred, the details are below.<br />
                  If the problem persists, contact us at our&nbsp;
                  <a
                    href="https://chat.decentraland.org"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Community Chat
                  </a>.<br />
                  <div className="error-stack">{transferError}</div>
                </React.Fragment>
              )}
            </Message>
          )}

          <TxStatus.Idle isIdle={isTxIdle} />
        </Form.Field>

        <br />

        <div className="text-center">
          <Button type="button" onClick={this.handleCancel}>
            Cancel
          </Button>

          <Button
            type="submit"
            primary={true}
            disabled={this.isEmptyAddress() || isTxIdle}
          >
            Submit
          </Button>
        </div>
      </Form>
    )
  }
}
