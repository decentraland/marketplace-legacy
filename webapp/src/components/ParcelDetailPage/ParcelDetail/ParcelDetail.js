import React from 'react'
import { Grid } from 'semantic-ui-react'
import ParcelName from 'components/ParcelName'
import ParcelOwner from './ParcelOwner'
import ParcelActions from './ParcelActions'
import { parcelType } from 'components/types'

export default class ParcelDetail extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired
  }

  render() {
    const { parcel, isOwner } = this.props

    return (
      <Grid
        columns={2}
        stackable={true}
        centered={true}
        className="ParcelDetail"
      >
        <Grid.Row>
          <Grid.Column width={6}>
            <ParcelName parcel={parcel} />
          </Grid.Column>
          <Grid.Column width={4}>
            <ParcelOwner parcel={parcel} />
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
            {parcel.description ? (
              <p className="parcel-description">{parcel.description}</p>
            ) : (
              <p className="parcel-description parcel-description-empty">
                This parcel has no description
              </p>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
