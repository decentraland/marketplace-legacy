import React from 'react'
import { Link } from 'react-router-dom'
import { parcelType } from 'components/types'
import ParcelTags from 'components/ParcelTags/ParcelTags'
import Icon from 'components/Icon'
import './ParcelAttributes.css'
import { locations } from 'locations'

export default class ParcelAttributes extends React.PureComponent {
  static propTypes = {
    parcel: parcelType
  }
  render() {
    const { parcel } = this.props
    return (
      <Link to={locations.parcelDetail(parcel.x, parcel.y)}>
        <div className="ParcelAttributes">
          <div className="coords">
            <Icon name="marker" />
            <span className="coord">{parcel.id}</span>
          </div>
          <ParcelTags parcel={parcel} size="small" />
        </div>
      </Link>
    )
  }
}
