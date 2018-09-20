import React from 'react'
import PropTypes from 'prop-types'
import { eth } from 'decentraland-eth'
import { Input } from 'semantic-ui-react'

import AddressBlock from 'components/AddressBlock'
import { t } from '@dapps/modules/translation/utils'

import './AddressInput.css'

export default class AddressInput extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    address: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    id: 'address-input'
  }

  handleAddressChange = event => {
    const { address, onChange } = this.props
    const newAddress = event.currentTarget.value
    if (address !== newAddress.toLowerCase()) {
      onChange(newAddress, event)
    }
  }

  render() {
    const { id, label, address, disabled } = this.props
    const hasError = !!address && !eth.utils.isValidAddress(address)
    return (
      <div className="AddressInput">
        {label && <label>{label}</label>}
        <div>
          <Input
            id={id}
            className="address-input"
            type="text"
            placeholder={t('global.address_placeholder')}
            value={address}
            onChange={this.handleAddressChange}
            autoComplete="off"
            autoFocus={true}
            disabled={disabled}
            error={hasError}
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
