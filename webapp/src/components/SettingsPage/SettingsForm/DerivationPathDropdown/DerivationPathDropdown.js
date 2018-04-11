import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { t } from 'modules/translation/utils'

import './DerivationPathDropdown.css'

const derivationOptions = [
  {
    text: "m/44'/60'/0'/0",
    description: 'Metamask, imToken, Ledger, TREZOR (ETH), etc'
  },
  { text: "m/44'/60'/160720'/0'", description: 'Ledger (ETC)' },
  { text: "m/44'/61'/0'/0", description: 'TREZOR (ETC)' }
].map(opt => Object.assign(opt, { value: opt.text }))

const DEFAULT_VALUE = derivationOptions[0].value
const PATH_PREFIX = 'm/'
const SUPPORTED_STARTING_PATHS = ["m/44'/60'", "m/44'/61'"]

export default class DerivationPathDropdown extends React.PureComponent {
  static propsTypes = Dropdown.propTypes

  static defaultProps = {
    value: DEFAULT_VALUE
  }

  constructor(props) {
    super(props)

    this.state = {
      isValid: true
    }
  }

  handleOnChange = (e, data) => {
    const isValid = this.isValid(data.value)

    if (isValid) {
      this.props.onChange(this.removePrefix(data.value))
    }

    this.setState({ isValid })
  }

  handleOnClick = () => {
    this.setState({ isValid: true })
  }

  getDerivationPath() {
    const derivationPath = this.props.value || DEFAULT_VALUE
    return this.addPrefix(derivationPath)
  }

  addPrefix(path) {
    return path.startsWith(PATH_PREFIX) ? path : `${PATH_PREFIX}${path}`
  }

  removePrefix(path) {
    return path.startsWith(PATH_PREFIX) ? path.slice(2) : path
  }

  isValid(derivationPath) {
    const validStart = SUPPORTED_STARTING_PATHS.some(path =>
      derivationPath.startsWith(path)
    )
    const validLength = derivationPath.split('/').length === 5

    return validStart && validLength
  }

  render() {
    const { isValid } = this.state
    const value = this.getDerivationPath()

    return (
      <div className="DerivationPathDropdown">
        <label>
          Derivation path&nbsp;
          <strong
            data-balloon-pos="up"
            data-balloon-length="xlarge"
            data-balloon={t('derivation_path.supported', {
              paths: SUPPORTED_STARTING_PATHS.join(', ')
            })}
          >
            ?
          </strong>
        </label>
        <Dropdown
          {...this.props}
          onChange={this.handleOnChange}
          onClick={this.handleOnClick}
          value={value}
          options={derivationOptions}
          allowAdditions
          search
          fluid
          selection
          required
        />
        <div className="invalid-derivation-path">
          {!isValid && t('derivation_path.invalid')}
        </div>
      </div>
    )
  }
}
