import React from 'react'
import { Link } from 'react-router-dom'

import locations from 'locations'

import './ColorCodesButton.css'

class ColorCodesButton extends React.PureComponent {
  handleClick = e => e.stopPropagation()

  render() {
    return (
      <Link to={locations.colorCodes} onClick={this.handleClick}>
        <div className="ColorCodesButton">
          <div className="top">
            <div className="square my-parcels" />
            <div className="square district" />
          </div>
          <div className="bottom">
            <div className="square contribution" />
            <div className="square taken" />
          </div>
        </div>
      </Link>
    )
  }
}

export default ColorCodesButton
