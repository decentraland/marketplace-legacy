import React from 'react'
import PropTypes from 'prop-types'
import { format } from 'lib/utils'

import './SidebarStats.css'

export default class SidebarStats extends React.PureComponent {
  static propTypes = {
    stats: PropTypes.shape({
      balance: PropTypes.number,
      parcels: PropTypes.number,
      contribDistricts: PropTypes.number,
      contribMana: PropTypes.number
    })
  }

  renderStatsValue(value) {
    const formattedValue = format(value, 'mana')
    return (
      <div
        className="stats-value"
        title={formattedValue.length >= 15 ? value : null}
      >
        {value === null ? '--' : formattedValue}
      </div>
    )
  }

  render() {
    const { stats } = this.props
    const { balance, parcels, contribDistricts, contribMana } = stats

    return (
      <ul className="SidebarStats">
        <li>
          <div className="stats-heading">BALANCE</div>
          {this.renderStatsValue(balance)}
        </li>
        <li>
          <div className="stats-heading">PARCELS</div>
          <div className="stats-value">{parcels == null ? '--' : parcels}</div>
        </li>
        <li>
          <div className="stats-heading">CONTRIB. DISTRICTS</div>
          <div className="stats-value">
            {contribDistricts == null ? '--' : contribDistricts}
          </div>
        </li>
        <li>
          <div className="stats-heading">CONTRIB. MANA</div>
          {this.renderStatsValue(contribMana)}
        </li>
      </ul>
    )
  }
}
