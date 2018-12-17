import React from 'react'
import PropTypes from 'prop-types'
import { Header } from 'semantic-ui-react'

import './Token.css'

export default class Token extends React.PureComponent {
  static propTypes = {
    symbol: PropTypes.string.isRequired,
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    loading: PropTypes.bool
  }
  render() {
    const { symbol, amount, loading, children } = this.props
    if (loading) {
      return (
        <Header size="large" className="Token">
          <span className="loading">--.--</span> {symbol}
        </Header>
      )
    }
    return (
      <Header size="large" className="Token">
        {symbol === 'MANA' ? (
          <span>
            <span className="symbol">⏣</span> {amount}
          </span>
        ) : (
          <span>
            {amount} {symbol}
          </span>
        )}
        {children}
      </Header>
    )
  }
}
