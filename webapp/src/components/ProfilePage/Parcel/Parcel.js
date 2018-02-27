import React from 'react'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { Card } from 'semantic-ui-react'
import ParcelName from 'components/ParcelName'
import ParcelPreview from 'components/ParcelPreview'
import { parcelType } from 'components/types'

import './Parcel.css'

export default class Parcel extends React.PureComponent {
  static propTypes = {
    parcel: parcelType
  }
  render() {
    const { parcel } = this.props

    return (
      <Card className="Parcel">
        <Link to={locations.parcelDetail(parcel.x, parcel.y)}>
          <div className="preview">
            <ParcelPreview x={parcel.x} y={parcel.y} />
          </div>
        </Link>
        <Card.Content className="body">
          <ParcelName parcel={parcel} size="small" />
          <Card.Meta>
            {parcel.data && parcel.data.description
              ? parcel.data.description
              : 'This parcel has no description'}
          </Card.Meta>
        </Card.Content>
      </Card>
    )
  }
}
