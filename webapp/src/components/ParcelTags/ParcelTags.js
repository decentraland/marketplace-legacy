import React from 'react'
import PropTypes from 'prop-types'

import { parcelType, districtType, estateType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import { getDistrict, isRoad, isPlaza } from 'shared/asset'

import './ParcelTags.css'

export default class ParcelTags extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    estate: estateType,
    districts: PropTypes.objectOf(districtType),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    showDetails: PropTypes.bool
  }

  static defaultProps = {
    districts: {},
    size: 'medium',
    showDetails: false
  }

  isParcel() {
    return !!this.props.parcel
  }

  getDistrictName(district_id) {
    const district = getDistrict({ district_id }, this.props.districts)
    return district ? district.name : null
  }

  renderProximityTag = (tag, key) => {
    const { size, showDetails } = this.props
    let name = null
    let districtName = null

    if (isPlaza(tag.district_id)) {
      name = 'plaza'
    } else if (isRoad(tag.district_id)) {
      name = 'road'
    } else {
      name = 'district'
      districtName = this.getDistrictName(tag.district_id)
    }

    return (
      <div className={`tag ${size}`} key={key}>
        <div
          className={`tag-icon tag-icon-${name}`}
          data-balloon-pos="up"
          data-balloon={districtName}
        />
        {showDetails ? this.renderTagDetails(name, tag.distance) : null}
      </div>
    )
  }

  renderTagDetails(name, distance) {
    return (
      <div className="tag-details">
        <h4>{t(`parcel_tags.${name}`)}</h4>
        <p>
          {distance === 0
            ? t('parcel_tags.adjacent')
            : t('parcel_tags.proximity', { distance })}
        </p>
      </div>
    )
  }

  getParcelTags() {
    return this.props.parcel.tags
  }

  getEstateTags() {
    const { parcels } = this.props.estate
    if (!parcels) {
      return []
    }
    const proximities = parcels
      .filter(parcel => !!parcel.tags.proximity)
      .map(parcel => parcel.tags.proximity)

    const proximity = proximities.reduce((finalProximity, actualProximity) => {
      Object.keys(actualProximity).forEach(key => {
        if (!finalProximity[key]) {
          finalProximity[key] = actualProximity[key]
          return
        }

        if (finalProximity[key].distance > actualProximity[key].distance) {
          finalProximity[key] = actualProximity[key]
          return
        }
      })
      return finalProximity
    }, {})

    return { proximity }
  }

  getTags() {
    if (this.isParcel()) {
      return this.getParcelTags()
    }

    return this.getEstateTags()
  }

  render() {
    const { proximity } = this.getTags()

    if (!proximity) {
      return null
    }

    const proximityTagKeys = Object.keys(proximity).sort()

    return (
      <div className="ParcelTags">
        {proximityTagKeys.map(key =>
          this.renderProximityTag(proximity[key], key)
        )}
      </div>
    )
  }
}
