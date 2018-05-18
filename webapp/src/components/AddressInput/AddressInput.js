import React from 'react'
import PropTypes from 'prop-types'
import { eth } from 'decentraland-eth'
import { Input } from 'semantic-ui-react'
import AddressBlock from 'components/AddressBlock'
import { t } from 'modules/translation/utils'

import './AddressInput.css'

export default class AddressInput extends React.PureComponent {
  static propTypes = {
    label: PropTypes.label,
    address: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool
  }

  handleAddressChange = event => {
    const { address, onChange } = this.props
    const newAddress = event.currentTarget.value
    if (address !== newAddress.toLowerCase()) {
      onChange(newAddress, event)
    }
  }

  render() {
    const { label, address, disabled } = this.props
    return (
      <div className="AddressInput">
        {label && <label>{label}</label>}
        <div>
          <Input
            id="address-input"
            className="address-input"
            type="text"
            placeholder={t('global.address_placeholder', {
              address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942'
            })}
            value={address}
            onChange={this.handleAddressChange}
            autoComplete="off"
            autoFocus={true}
            disabled={disabled}
            error={address && !eth.utils.isValidAddress(address)}
          />
          {address && (
            <AddressBlock
              className="address-input-blockie"
              address={address}
              hasTooltip={false}
              hasLink={false}
            />
          )}
        </div>
      </div>
    )
  }
}
