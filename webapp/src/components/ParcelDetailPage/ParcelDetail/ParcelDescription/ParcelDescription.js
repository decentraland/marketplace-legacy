import React from 'react'
import PropTypes from 'prop-types'

export default class ParcelDescription extends React.PureComponent {
  static propTypes = {
    description: PropTypes.string
  }

  render() {
    const { description } = this.props

    const className =
      'parcel-description' + (description ? '' : ' parcel-description-empty')

    return (
      <div>
        <p className={className}>{description}</p>
      </div>
    )
  }
}
