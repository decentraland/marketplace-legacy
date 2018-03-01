import React from 'react'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { Button, Card } from 'semantic-ui-react'
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
            <ParcelPreview x={parcel.x} y={parcel.y} size={18} />
          </div>
        </Link>
        <Card.Content extra>
          <span className="footer">
            <ParcelName x={parcel.x} y={parcel.y} size="large" />
            <Link to={locations.parcelDetail(parcel.x, parcel.y)}>
              <Button size="tiny">View</Button>
            </Link>
          </span>
        </Card.Content>
      </Card>
    )
  }
}
