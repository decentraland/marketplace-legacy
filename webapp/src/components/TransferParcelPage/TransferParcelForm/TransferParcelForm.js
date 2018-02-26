import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input, Message, Icon } from 'semantic-ui-react'
import { parcelType } from 'components/types'
import { preventDefault } from 'lib/utils'

import './TransferParcelForm.css'

export default class TransferParcelForm extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    error: PropTypes.string,
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
    const { error } = this.props
    const { address } = this.state
    const newAddress = e.currentTarget.value

    if (address !== newAddress) {
      if (error) this.handleClearFormErrors()
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

  isEmptyAddress() {
    return this.state.address.trim() === ''
  }

  isTransferError() {
    return !this.props.error.includes('Error: Error:')
  }

  render() {
    const { onCancel, error } = this.props
    const { address } = this.state
    const inputClassName = `address-input ${error ? 'address-input-error' : ''}`

    return (
      <Form
        className="TransferParcelForm"
        onSubmit={preventDefault(this.handleSubmit)}
        error={!!error}
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

          {error && (
            <Message error onDismiss={this.handleClearFormErrors}>
              {this.isTransferError() ? (
                <React.Fragment>{error}</React.Fragment>
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
                  <div className="error-stack">{error}</div>
                </React.Fragment>
              )}
            </Message>
          )}
        </Form.Field>

        <br />

        <div className="text-center">
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" primary={true} disabled={this.isEmptyAddress()}>
            Submit
          </Button>
        </div>
      </Form>
    )
  }
}
