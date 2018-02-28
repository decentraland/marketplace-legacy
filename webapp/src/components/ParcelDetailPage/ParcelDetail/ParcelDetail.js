import React from 'react'
import PropTypes from 'prop-types'
import { Header, Grid } from 'semantic-ui-react'
import ParcelName from 'components/ParcelName'
import ParcelOwner from './ParcelOwner'
import ParcelActions from './ParcelActions'
import { parcelType, districtType } from 'components/types'

export default class ParcelDetail extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    districts: PropTypes.objectOf(districtType).isRequired
  }

  getDescription() {
    const { parcel, districts } = this.props
    if (districts && parcel.district_id && districts[parcel.district_id]) {
      return districts[parcel.district_id].description
    }
    if (parcel.data.description) {
      return parcel.data.description
    }

    return null
  }

  render() {
    const { parcel, districts, isOwner } = this.props

    const description = this.getDescription()

    return (
      <Grid
        columns={2}
        stackable={true}
        centered={true}
        className="ParcelDetail"
      >
        <Grid.Row>
          <Grid.Column width={6}>
            <Header size="large">
              <ParcelName parcel={parcel} />
            </Header>
          </Grid.Column>
          <Grid.Column width={4}>
            <ParcelOwner parcel={parcel} districts={districts} />
          </Grid.Column>
        </Grid.Row>
        {isOwner ? (
          <Grid.Row>
            <Grid.Column width={10}>
              <ParcelActions parcel={parcel} />
            </Grid.Column>
          </Grid.Row>
        ) : null}
        <Grid.Row>
          <Grid.Column width={10}>
            <h3>Description</h3>
            <p
              className={
                'parcel-description' +
                (description ? '' : ' parcel-description-empty')
              }
            >
              {description || 'This parcel has no description'}
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
