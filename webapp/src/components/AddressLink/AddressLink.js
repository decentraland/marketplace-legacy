import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import Blockie from 'components/Blockie'
import { shortenAddress } from 'lib/utils'

import './AddressLink.css'

export default class AddressLink extends React.Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    link: PropTypes.string,
    size: PropTypes.number,
    scale: PropTypes.number,
    hasTooltip: PropTypes.bool,
    isUser: PropTypes.bool,
    className: PropTypes.string
  }

  static defaultProps = {
    link: null,
    size: 6,
    scale: 3,
    hasTooltip: true,
    className: ''
  }

  render() {
    const {
      address,
      link,
      size,
      scale,
      hasTooltip,
      isUser,
      className
    } = this.props

    return (
      <div
        className={`AddressLink ${className}`}
        data-balloon-pos="up"
        data-balloon={
          hasTooltip ? (isUser ? 'You!' : shortenAddress(address)) : null
        }
      >
        {address && (
          <Link to={link ? link : locations.addressDetail(address)}>
            <Blockie seed={address} size={size} scale={scale} />
          </Link>
        )}
      </div>
    )
  }
}
