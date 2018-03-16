import React from 'react'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { Card, Icon } from 'semantic-ui-react'
import ParcelPreview from 'components/ParcelPreview'
import { parcelType } from 'components/types'
import { t } from 'modules/translation/utils'
import { buildCoordinate } from 'lib/utils'

import './Parcel.css'

export default class Parcel extends React.PureComponent {
  static propTypes = {
    parcel: parcelType
  }
  render() {
    const { parcel } = this.props

    return (
      <Card className="Parcel" link>
        <Link to={locations.parcelDetail(parcel.x, parcel.y)}>
          <div className="preview">
            <ParcelPreview x={parcel.x} y={parcel.y} size={12} />
          </div>
          <Card.Content extra>
            <div className="name">
              {parcel.data.name || t('parcel.no_name')}
            </div>
            <div className="description">
              {parcel.data.description || t('parcel.no_description')}
            </div>
            <div className="coords">
              <Icon name="marker" size="small" />
              {buildCoordinate(parcel.x, parcel.y)}
            </div>
          </Card.Content>
        </Link>
      </Card>
    )
  }
}
