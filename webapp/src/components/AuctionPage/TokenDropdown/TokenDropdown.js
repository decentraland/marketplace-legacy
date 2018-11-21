import React from 'react'
import { Dropdown } from 'semantic-ui-react'

import { SYMBOLS } from 'modules/auction/utils'

import './TokenDropdown.css'

const OPTIONS = SYMBOLS.map(symbol => ({
  text: symbol,
  value: symbol
}))

export default class TokenDropdown extends React.PureComponent {
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
