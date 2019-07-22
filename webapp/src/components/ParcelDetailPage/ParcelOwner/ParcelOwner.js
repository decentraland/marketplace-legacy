import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'
import { t, T } from '@dapps/modules/translation/utils'

import { locations } from 'locations'
import AddressBlock from 'components/AddressBlock'
import {
  walletType,
  parcelType,
  districtType,
  estateType
} from 'components/types'
import { getDistrict, isDistrict } from 'shared/district'
import { can, ACTIONS, isOwner } from 'shared/roles'

import './ParcelOwner.css'

export default class ParcelOwner extends React.PureComponent {
  static propTypes = {
    wallet: walletType.isRequired,
    parcel: parcelType.isRequired,
    estates: PropTypes.objectOf(estateType).isRequired,
    districts: PropTypes.objectOf(districtType).isRequired
  }

  renderOwner() {
    const { parcel } = this.props
    return (
      <span className="is-address">
        <span>{t('global.owned_by')}</span>
        <AddressBlock address={parcel.owner} scale={4} />
      </span>
    )
  }

  renderDistrict() {
    const { parcel, districts } = this.props
    const district = getDistrict(parcel, districts)
    if (!district) return null

    let districtName = !district.link ? (
      <a
        title={district.name}
        href={district.link}
        target="blank"
        rel="nooper noreferrer"
      >
        {district.name}
      </a>
    ) : (
      <span className="district-name">{district.name}</span>
    )

    return (
      <span className="part-of">
        <T id="parcel_detail.owner.part_of" values={{ name: districtName }} />
      </span>
    )
  }

  renderAccess(canEdit, canManage) {
    const { wallet, parcel } = this.props
    return (
      <React.Fragment>
        <span className="has-access">
          {canEdit ? (
            <Link to={locations.editParcel(parcel.x, parcel.y)}>
              <Button size="tiny" className="link">
                <Icon name="pencil" />
                {t('global.edit')}
              </Button>
            </Link>
          ) : null}
          {canManage ? (
            <Link to={locations.manageParcel(parcel.x, parcel.y)}>
              <Button size="tiny" className="link">
                <Icon name="add user" />
                {t('asset_detail.actions.permissions')}
              </Button>
            </Link>
          ) : null}
        </span>
        {!isOwner(wallet.address, parcel) ? this.renderOwner() : null}
      </React.Fragment>
    )
  }

  renderInEstate() {
    const { estates, parcel } = this.props
    if (!estates) return null
    const estate = estates[parcel.estate_id]
    if (estate) {
      const estateName = (
        <Link to={locations.estateDetail(estate.id)}>{estate.data.name}</Link>
      )
      return (
        <span className="part-of">
          <T id="parcel_detail.owner.part_of" values={{ name: estateName }} />
        </span>
      )
    }
  }

  render() {
    const { wallet, parcel } = this.props
    if (!parcel) {
      return null
    }

    const canEdit = can(ACTIONS.updateMetadata, wallet.address, parcel)
    const canManage = can(ACTIONS.setUpdateOperator, wallet.address, parcel)

    return (
      <div className="ParcelOwner">
        {isDistrict(parcel) ? (
          this.renderDistrict()
        ) : canEdit || canManage ? (
          this.renderAccess(canEdit, canManage)
        ) : parcel.estate_id ? (
          this.renderInEstate()
        ) : parcel.owner ? (
          this.renderOwner()
        ) : (
          <span className="is-address">
            {t('parcel_detail.owner.no_owner')}
          </span>
        )}
      </div>
    )
  }
}
