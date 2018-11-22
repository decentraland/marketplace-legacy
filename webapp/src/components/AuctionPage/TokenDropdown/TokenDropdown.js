import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'semantic-ui-react'

import { TOKEN_SYMBOLS } from 'modules/auction/utils'

import './TokenDropdown.css'

const OPTIONS = TOKEN_SYMBOLS.map(symbol => ({
  text: symbol,
  value: symbol
}))

export default class TokenDropdown extends React.PureComponent {
  static propTypes = {
    token: PropTypes.oneOf(TOKEN_SYMBOLS),
    onChange: PropTypes.func
  }

  handleChange = (_, { value }) => {
    const { token, onChange } = this.props
    if (token !== value && onChange) {
      onChange(value)
    }
  }

  render() {
    const { token } = this.props
    return (
      <div className="TokenDropdown">
        <Dropdown
          value={token}
          options={OPTIONS}
          onChange={this.handleChange}
          upward
        />
      </div>
    )
  }
}
