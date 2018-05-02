import React from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Input, Message } from 'semantic-ui-react'
import { parcelType } from 'components/types'
import TxStatus from 'components/TxStatus'
import { isTransactionRejectedError } from 'modules/transaction/utils'
import { isOnSale } from 'lib/parcelUtils'
import { preventDefault } from 'lib/utils'
import { t } from 'modules/translation/utils'

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

  static defaultProps = {
    transferError: null
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

    if (address !== newAddress.toLowerCase()) {
      if (transferError) this.handleClearFormErrors()
      this.setState({ address: newAddress })
    }
  }

  handleSubmit = () => {
    const { parcel } = this.props
    const newAddress = this.state.address.trim().toLowerCase()
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
    const { parcel, isTxIdle, transferError } = this.props
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
          <label>{t('parcel_transfer.recipient_address')}</label>
          <Input
            id="address-input"
            className={inputClassName}
            type="text"
            placeholder={t('parcel_transfer.placeholder', {
              address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942'
            })}
            value={address}
            onChange={this.handleAddressChange}
            autoComplete="off"
            autoFocus={true}
          />
          <span className="transfer-warning">
            {t('parcel_transfer.irreversible')}
          </span>
          <br />
          <span className="transfer-warning">
            {t('parcel_transfer.check_address')}
          </span>
          <br />
          {this.hasError() && (
            <Message error onDismiss={this.handleClearFormErrors}>
              {this.isExpectedError() ? (
                <React.Fragment>{transferError}</React.Fragment>
              ) : (
                <React.Fragment>
                  {t('transfer_land.unknown_error')}
                  <br />
                  {t('transfer_land.error_persists', {
                    community_chat_link: (
                      <a
                        href="https://chat.decentraland.org"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {t('global.community_chat')}
                      </a>
                    )
                  })}
                  <br />
                  <div className="error-stack">{transferError}</div>
                </React.Fragment>
              )}
            </Message>
          )}

          <TxStatus.Idle isIdle={isTxIdle} />
        </Form.Field>

        <br />

        <div>
          <Button type="button" onClick={this.handleCancel}>
            {t('global.cancel')}
          </Button>

          <Button
            type="submit"
            primary={true}
            disabled={this.isEmptyAddress() || isOnSale(parcel) || isTxIdle}
          >
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
