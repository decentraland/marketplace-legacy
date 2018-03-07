import React from 'react'
import PropTypes from 'prop-types'
import { Header, Grid } from 'semantic-ui-react'
import ParcelName from 'components/ParcelName'
import ParcelOwner from './ParcelOwner'
import ParcelActions from './ParcelActions'
import ParcelPublication from './ParcelPublication'
import { parcelType, districtType } from 'components/types'
import { hasPublication } from 'lib/parcelUtils'

export default class ParcelDetail extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    districts: PropTypes.objectOf(districtType).isRequired,
    onBuy: PropTypes.func.isRequired
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

  getPublication() {
    const { parcel, publications } = this.props
    if (hasPublication(parcel, publications)) {
      return publications[parcel.publication_tx_hash]
    }
    return null
  }

  handleBuy = () => {
    const { parcel, onBuy } = this.props
    onBuy(parcel)
  }

  render() {
    const { parcel, districts, isOwner } = this.props

    const description = this.getDescription()
    const publication = this.getPublication()

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
          <Grid.Column width={4} textAlign="right">
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
        {publication ? (
          <ParcelPublication
            publication={publication}
            isOwner={isOwner}
            onBuy={this.handleBuy}
          />
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
