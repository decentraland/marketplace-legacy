import React from 'react'
import PropTypes from 'prop-types'

export default class SettingsPage extends React.PureComponent {
  static propTypes = {
    address: PropTypes.string
  }

  render() {
    return (
      <div>
        <h1>SettingsPage</h1>
      </div>
    )
  }
}
