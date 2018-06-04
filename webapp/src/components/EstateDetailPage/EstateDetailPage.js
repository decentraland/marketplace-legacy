import React from 'react'
import PropTypes from 'prop-types'

import { districtType, publicationType } from 'components/types'

import './EstateDetailPage.css'

export default class EstateDetailPage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    districts: PropTypes.objectOf(districtType).isRequired,
    publications: PropTypes.objectOf(publicationType),
    user: PropTypes.string,
    onParcelClick: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      return this.props.onError(nextProps.error)
    }
  }

  render() {
    const { error } = this.props

    if (error) {
      return null
    }
    return <div className="EstateDetailPage" />
  }
}
