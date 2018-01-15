import React from 'react'
import PropTypes from 'prop-types'

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
  render() {
    const { stats } = this.props
    return (
      <ul className="SidebarStats">
        <li>
          <div className="stats-heading">BALANCE</div>
          <div className="stats-value">{stats.balance}</div>
        </li>
        <li>
          <div className="stats-heading">PARCELS</div>
          <div className="stats-value">{stats.parcels}</div>
        </li>
        <li>
          <div className="stats-heading">CONTRIB. DISTRICTS</div>
          <div className="stats-value">{stats.contribDistricts}</div>
        </li>
        <li>
          <div className="stats-heading">CONTRIB. MANA</div>
          <div className="stats-value">{stats.contribMana}</div>
        </li>
      </ul>
    )
  }
}
