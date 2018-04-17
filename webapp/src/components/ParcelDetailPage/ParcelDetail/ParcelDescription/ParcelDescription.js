import React from 'react'
import PropTypes from 'prop-types'

import './ParcelDescription.css'

export default class ParcelDescription extends React.PureComponent {
  static propTypes = {
    description: PropTypes.string
  }

  render() {
    const { description } = this.props

    const className = 'description' + (description ? '' : ' description-empty')

    return (
      <div className="ParcelDescription">
        <p className={className}>{description}</p>
      </div>
    )
  }
}
