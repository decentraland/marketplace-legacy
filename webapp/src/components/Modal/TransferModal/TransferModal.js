import React from 'react'

import BaseModal from '../BaseModal'
import Button from 'components/Button'

import './TransferModal.css'

export default class TransferModal extends React.Component {
  static propTypes = {
    ...BaseModal.propTypes
  }

  constructor(props) {
    super(props)

    this.state = {
      address: ''
    }
  }

  handleAddressChange = e => {
    this.setState({
      address: e.currentTarget.value
    })
  }

  render() {
    const { onClose, data, ...props } = this.props
    const { address } = this.state
    const { x, y } = data // data === parcel

    return (
      <BaseModal
        className="TransferModal modal-lg"
        onClose={onClose}
        {...props}
      >
        <div className="banner">
          <h2>
            Transfer LAND {x},{y}
          </h2>
        </div>

        <div className="modal-body">
          <form action="POST">
            <div className="text">
              <p>
                Remember that transfering LAND is an irreversible operation.<br />
                Please check the address carefully.
              </p>

              <div className="address-container">
                <label htmlFor="address-input">Recipient address</label>
                <input
                  id="address-input"
                  className="address-input"
                  type="text"
                  placeholder="Ex: 0x0f5d2fb29fb7d3cfee444a200298f468908cc942"
                  value={address}
                  onChange={this.handleAddressChange}
                />
              </div>
            </div>

            <div className="submit-transfer">
              <Button type="primary" isSubmit={true} onClick={onClose}>
                TRANSFER
              </Button>
            </div>
          </form>
        </div>
      </BaseModal>
    )
  }
}
