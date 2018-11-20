import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { parcelType } from 'components/types'
import ParcelTags from 'components/ParcelTags/ParcelTags'
import Icon from 'components/Icon'
import './ParcelAttributes.css'

export default class ParcelAttributes extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    withLink: PropTypes.bool
  }

  static defaultProps = {
    withLink: true
  }

  render() {
    const { parcel, withLink } = this.props

    const Wrapper = withLink ? Link : React.Fragment
    const wrapperProps = withLink
      ? { to: locations.parcelDetail(parcel.x, parcel.y) }
      : {}

    return (
      <Wrapper {...wrapperProps}>
        <div className="ParcelAttributes">
          <div className="coords">
            <Icon name="marker" />
            <span className="coord">{parcel.id}</span>
          </div>
        </div>
      </Wrapper>
    )
  }
}
