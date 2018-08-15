import React from 'react'
import PropTypes from 'prop-types'

import { estateType } from 'components/types'
import Asset from 'components/Asset'

export default class Estate extends React.PureComponent {
  static propTypes = {
    estate: estateType,
    id: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    onAccessDenied: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
    onEstateFetched: PropTypes.func
  }

  static defaultProps = {
    estate: null
  }

  isConnected = address => {
    return address.estate_ids && address.estate_ids.length > 0
  }

  render() {
    const { estate } = this.props
    return (
      <Asset value={estate} isConnected={this.isConnected} {...this.props} />
    )
  }
}
