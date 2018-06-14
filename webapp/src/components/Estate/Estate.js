import React from 'react'
import PropTypes from 'prop-types'
import { estateType } from 'components/types'
import Asset from 'components/Asset'

export default class Estate extends React.PureComponent {
  static propTypes = {
    estate: estateType,
    onAccessDenied: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    estate: null
  }

  isConnected = address => {
    return !!address.estate_ids
  }

  render() {
    const { estate } = this.props
    return (
      <Asset value={estate} isConnected={this.isConnected} {...this.props} />
    )
  }
}
