import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import Blockie from 'components/Blockie'
import { t } from '@dapps/modules/translation/utils'
import { shortenAddress } from 'lib/utils'

import './AddressBlock.css'

export default class AddressBlock extends React.Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    link: PropTypes.string,
    size: PropTypes.number,
    scale: PropTypes.number,
    hasTooltip: PropTypes.bool,
    hasLink: PropTypes.bool,
    isUser: PropTypes.bool,
    className: PropTypes.string
  }

  static defaultProps = {
    link: null,
    size: 6,
    scale: 3,
    hasTooltip: true,
    hasLink: true,
    className: ''
  }

  render() {
    const {
      address,
      link,
      size,
      scale,
      hasTooltip,
      hasLink,
      isUser,
      className
    } = this.props

    if (address == null) {
      return null
    }

    const blockie = (
      <Blockie seed={address.toLowerCase()} size={size} scale={scale} />
    )

    let tooltip = null
    if (hasTooltip) {
      tooltip = isUser ? t('address.its_you') : shortenAddress(address)
    }

    return (
      <div
        className={`AddressBlock ${className}`}
        data-balloon-pos="up"
        data-balloon={tooltip}
      >
        {hasLink ? (
          <Link to={link || locations.profilePageDefault(address)}>
            {blockie}
          </Link>
        ) : (
          blockie
        )}
      </div>
    )
  }
}
