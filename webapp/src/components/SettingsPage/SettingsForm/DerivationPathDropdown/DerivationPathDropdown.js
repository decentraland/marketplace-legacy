import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const derivationOptions = [
  {
    text: "m/44'/60'/0'/0",
    description:
      'Jaxx, Metamask, Exodus, imToken, TREZOR (ETH) & Digital Bitbox'
  },
  { text: "m/44'/60'/0'", description: 'Ledger (ETH)' },
  { text: "m/44'/60'/160720'/0'", description: 'Ledger (ETC)' },
  { text: "m/44'/61'/0'/0", description: 'TREZOR (ETC)' },
  { text: "m/0'/0'/0'", description: 'SingularDTV' },
  { text: "m/44'/1'/0'/0", description: 'Network: Testnets' },
  { text: "m/44'/40'/0'/0", description: 'Network: Expanse' },
  { text: "m/44'/108'/0'/0", description: 'Network: Ubiq' },
  { text: "m/44'/163'/0'/0", description: 'Network: Ellaism' }
].map(opt => Object.assign(opt, { value: opt.text }))

const DEFAULT_VALUE = derivationOptions[0].value

export default class DerivationPathDropdown extends React.PureComponent {
  static props = Dropdown.propTypes

  static defaultProps = {
    defaultValue: DEFAULT_VALUE
  }

  getDefaultDerivationPath() {
    const defaultValue = this.props.defaultValue || DEFAULT_VALUE
    return defaultValue.startsWith('m/') ? defaultValue : `m/${defaultValue}`
  }

  render() {
    const defaultValue = this.getDefaultDerivationPath()

    return (
      <React.Fragment>
        <label>Derivation path</label>
        <Dropdown
          {...this.props}
          defaultValue={defaultValue}
          options={derivationOptions}
          allowAdditions
          search
          fluid
          selection
          required
        />
      </React.Fragment>
    )
  }
}
