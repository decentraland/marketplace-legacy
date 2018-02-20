import React from 'react'
import PropTypes from 'prop-types'
import { parcelType, districtType } from 'components/types'
import { getDistrict, isDistrict } from 'lib/parcelUtils'
import AddressLink from 'components/AddressLink'

import './ParcelOwner.css'

export default class ParcelName extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    districts: PropTypes.objectOf(districtType).isRequired
  }

  render() {
    const { districts, parcel } = this.props
    if (!parcel) {
      return null
    }
    if (isDistrict(parcel)) {
      const district = getDistrict(parcel, districts)
      if (!district) return
      let districtName = <span className="district-name">{district.name}</span>
      if (district.link) {
        districtName = (
          <a
            title={district.name}
            href={district.link}
            target="blank"
            rel="nooper noreferrer"
          >
            {district.name}
          </a>
        )
      }
      return (
        <span className="ParcelOwner is-district">
          Part of &nbsp;{districtName}
        </span>
      )
    }
    if (parcel.owner) {
      return (
        <span className="ParcelOwner is-address">
          Owned by&nbsp;&nbsp;<AddressLink address={parcel.owner} scale={2} />
        </span>
      )
    }
    return <span className="ParcelOwner is-address">No owner</span>
  }
}
