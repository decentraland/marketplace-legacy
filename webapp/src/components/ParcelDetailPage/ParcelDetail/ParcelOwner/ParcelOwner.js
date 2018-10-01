import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { utils } from 'decentraland-commons'
import { Button, Icon } from 'semantic-ui-react'
import { locations } from 'locations'
import AddressBlock from 'components/AddressBlock'
import { parcelType, districtType, estateType } from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import { getDistrict, isDistrict } from 'shared/asset'

import './ParcelOwner.css'

export default class ParcelOwner extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    districts: PropTypes.objectOf(districtType).isRequired,
    estates: PropTypes.objectOf(estateType).isRequired
  }

  render() {
    const { districts, estates, parcel, isOwner } = this.props
    if (!parcel || utils.isEmptyObject(districts)) {
      return null
    }

    if (isOwner) {
      return (
        <span className="ParcelOwner is-owner">
          <Link
            to={locations.editParcel(parcel.x, parcel.y)}
            className="edit-button"
          >
            <Button size="tiny" className="link">
              <Icon name="pencil" />
              {t('global.edit')}
            </Button>
          </Link>
          <Link
            to={locations.manageParcel(parcel.x, parcel.y)}
            className="manage-button"
          >
            <Button size="tiny" className="link">
              <Icon name="add user" />
              {t('asset_detail.actions.permissions')}
            </Button>
          </Link>
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
        <span className="ParcelOwner part-of">
          <T id="parcel_detail.owner.part_of" values={{ name: districtName }} />
        </span>
      )
    }

    if (parcel.estate_id) {
      if (!estates) return null
      const estate = estates[parcel.estate_id]
      if (estate) {
        const estateName = (
          <Link to={locations.estateDetail(estate.id)}>{estate.data.name}</Link>
        )
        return (
          <span className="ParcelOwner part-of">
            <T id="parcel_detail.owner.part_of" values={{ name: estateName }} />
          </span>
        )
      }
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
