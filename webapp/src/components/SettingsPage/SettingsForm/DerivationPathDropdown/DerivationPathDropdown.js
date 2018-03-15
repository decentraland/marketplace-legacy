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
  { text: "m/44'/61'/0'/0", description: 'TREZOR (ETC)' }
].map(opt => Object.assign(opt, { value: opt.text }))

const DEFAULT_VALUE = derivationOptions[0].value
const PATH_PREFIX = 'm/'

export default class DerivationPathDropdown extends React.PureComponent {
  static propsTypes = Dropdown.propTypes

  static defaultProps = {
    defaultValue: DEFAULT_VALUE
  }

  handleOnChange = (e, data) => {
    const derivationPath = this.removePrefix(data.value)
    this.props.onChange(derivationPath)
  }

  getDefaultDerivationPath() {
    const defaultValue = this.props.defaultValue || DEFAULT_VALUE
    return this.addPrefix(defaultValue)
  }

  addPrefix(path) {
    return path.startsWith(PATH_PREFIX) ? path : `${PATH_PREFIX}${path}`
  }

  removePrefix(path) {
    return path.startsWith(PATH_PREFIX) ? path.slice(2) : path
  }

  render() {
    const defaultValue = this.getDefaultDerivationPath()

    return (
      <React.Fragment>
        <label>Derivation path</label>
        <Dropdown
          {...this.props}
          onChange={this.handleOnChange}
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
