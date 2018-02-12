import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import Blockie from 'components/Blockie'

import './AccountControls.css'

export default class AccountControls extends React.Component {
  static propTypes = {
    address: PropTypes.string
  }

  render() {
    const { address } = this.props

    return (
      <div className="AccountControls">
        {address && (
          <Link to={locations.settings}>
            <Blockie seed={address} size={10.667} scale={3} />
          </Link>
        )}
      </div>
    )
  }
}
