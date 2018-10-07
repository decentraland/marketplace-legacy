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
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    estate: null
  }

  constructor(props) {
    super(props)
    this.shouldRefresh = false
  }

  componentWillReceiveProps(nextProps) {
    const { estate } = this.props
    if (estate && nextProps.estate && estate.id !== nextProps.estate.id) {
      this.shouldRefresh = true
    }
  }

  componentDidUpdate() {
    if (this.shouldRefresh) {
      this.props.onLoaded()
      this.shouldRefresh = false
    }
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
