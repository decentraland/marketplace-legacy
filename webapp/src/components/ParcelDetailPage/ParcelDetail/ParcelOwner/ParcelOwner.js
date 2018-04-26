import React from 'react'
import PropTypes from 'prop-types'
import { utils } from 'decentraland-commons'
import { parcelType, districtType } from 'components/types'
import { getDistrict, isDistrict } from 'lib/parcelUtils'
import AddressBlock from 'components/AddressBlock'
import { t, t_html } from 'modules/translation/utils'

import './ParcelOwner.css'

export default class ParcelOwner extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    districts: PropTypes.objectOf(districtType).isRequired
  }

  render() {
    const { districts, parcel } = this.props
    if (!parcel || utils.isEmpty(districts)) {
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
          {t_html('parcel_detail.owner.part_of', { name: districtName })}
        </span>
      )
    }

    if (parcel.owner) {
      return (
        <span className="ParcelOwner is-address">
          <span>{t('global.owned_by')}</span>
          <AddressBlock address={parcel.owner} scale={4} />
        </span>
      )
    }

    return (
      <span className="ParcelOwner is-address">
        {t('parcel_detail.owner.no_owner')}
      </span>
    )
  }
}
