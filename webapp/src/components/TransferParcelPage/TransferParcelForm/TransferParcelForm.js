import React from 'react'
import PropTypes from 'prop-types'
import { eth } from 'decentraland-eth'

import { Button, Form } from 'semantic-ui-react'
import { parcelType } from 'components/types'
import TxStatus from 'components/TxStatus'
import AddressInput from 'components/AddressInput'
import { preventDefault } from 'lib/utils'
import { t } from 'modules/translation/utils'

import './TransferParcelForm.css'

export default class TransferParcelForm extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    isTxIdle: PropTypes.bool,
    isOnSale: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  static defaultProps = {}

  constructor(props) {
    super(props)

    this.state = {
      address: ''
    }
  }

  handleAddressChange = address => {
    this.setState({ address })
  }

  handleSubmit = () => {
    const { parcel } = this.props
    const newAddress = this.state.address.trim().toLowerCase()
    this.props.onSubmit(parcel, newAddress)
  }

  handleCancel = () => {
    this.props.onCancel()
  }

  isValidAddress() {
    const { address } = this.state
    return address.trim() !== '' && eth.utils.isValidAddress(address)
  }

  render() {
    const { isTxIdle, isOnSale } = this.props
    const { address } = this.state

    return (
      <Form
        className="TransferParcelForm"
        onSubmit={preventDefault(this.handleSubmit)}
        error={this.isValidAddress()}
      >
        <Form.Field>
          <AddressInput
            label={t('transfer_parcel.recipient_address')}
            address={address}
            onChange={this.handleAddressChange}
          />
          <span className="transfer-warning">
            {t('transfer_parcel.irreversible')}
          </span>
          <br />
          <span className="transfer-warning">
            {t('transfer_parcel.check_address')}
          </span>
        </Form.Field>
        <br />
        <TxStatus.Idle isIdle={isTxIdle} />
        <br />
        <div className="modal-buttons">
          <Button type="button" onClick={this.handleCancel}>
            {t('global.cancel')}
          </Button>

          <Button
            type="submit"
            primary={true}
            disabled={isOnSale || !this.isValidAddress() || isTxIdle}
          >
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
