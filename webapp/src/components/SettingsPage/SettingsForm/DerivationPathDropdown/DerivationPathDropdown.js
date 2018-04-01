import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { t } from 'modules/translation/utils'

const derivationOptions = [
  {
    text: "m/44'/60'/0'/0",
    description:
      'Jaxx, Metamask, Exodus, imToken, Ledger & TREZOR (ETH) & Digital Bitbox'
  },
  { text: "m/44'/60'/160720'/0'", description: 'Ledger (ETC)' },
  { text: "m/44'/61'/0'/0", description: 'TREZOR (ETC)' }
].map(opt => Object.assign(opt, { value: opt.text }))

const DEFAULT_VALUE = derivationOptions[0].value
const PATH_PREFIX = 'm/'
const SUPPORTED_PATHS = ["m/44'/60'", "m/44'/61'"]

export default class DerivationPathDropdown extends React.PureComponent {
  static propsTypes = Dropdown.propTypes

  static defaultProps = {
    defaultValue: DEFAULT_VALUE
  }

  handleOnChange = (e, data) => {
    const derivationPath = data.value

    if (this.isValid(derivationPath)) {
      this.props.onChange(this.removePrefix(derivationPath))
    }
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

  isValid(derivationPath) {
    return SUPPORTED_PATHS.some(path => derivationPath.startsWith(path))
  }

  render() {
    const defaultValue = this.getDefaultDerivationPath()

    return (
      <React.Fragment>
        <label>
          Derivation path&nbsp;
          <strong
            data-balloon-pos="up"
            data-balloon-length="xlarge"
            data-balloon={t('derivation_path.supported', {
              paths: SUPPORTED_PATHS.join(', ')
            })}
          >
            ?
          </strong>
        </label>
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
