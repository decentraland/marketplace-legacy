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
  render() {
    const { stats } = this.props
    const { balance, parcels, contribDistricts, contribMana } = stats
    return (
      <ul className="SidebarStats">
        <li>
          <div className="stats-heading">BALANCE</div>
          <div className="stats-value">
            {balance === null ? '--' : format(balance, 'mana')}
          </div>
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
          <div className="stats-value">
            {contribMana == null ? '--' : format(contribMana, 'mana')}
          </div>
        </li>
      </ul>
    )
  }
}
