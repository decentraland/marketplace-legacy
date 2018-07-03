import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { utils } from 'decentraland-commons'
import { Button, Icon } from 'semantic-ui-react'
import { parcelType, districtType } from 'components/types'
import { getDistrict, isDistrict } from 'shared/asset'
import AddressBlock from 'components/AddressBlock'
import { t, t_html } from 'modules/translation/utils'
import { locations } from 'locations'

import './ParcelOwner.css'

export default class ParcelOwner extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    districts: PropTypes.objectOf(districtType).isRequired
  }

  render() {
    const { districts, parcel, isOwner } = this.props
    if (!parcel || utils.isEmptyObject(districts)) {
      return null
    }

    if (isOwner) {
      return (
        <span className="ParcelOwner is-owner">
          <Button size="tiny" className="link">
            <Icon name="pencil" />
            <Link to={locations.editLand(parcel.x, parcel.y)}>
              {t('parcel_detail.actions.edit')}
            </Link>
          </Button>
          <Button size="tiny" className="link">
            <Icon name="add user" />
            <Link to={locations.manageLand(parcel.x, parcel.y)}>
              {t('parcel_detail.actions.permissions')}
            </Link>
          </Button>
        </span>
      )
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
