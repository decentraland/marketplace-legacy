import React from 'react'
import PropTypes from 'prop-types'

import './LandAmount.css'

export default class LandAmount extends React.PureComponent {
  static propTypes = {
    value: PropTypes.number.isRequired
  }

  render() {
    const { value } = this.props
    return (
      <span className="LandAmount">
        <i className="land-icon" />
        <span>{value} LAND</span>
      </span>
    )
  }
}
