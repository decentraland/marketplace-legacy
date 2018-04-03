import React from 'react'
import PropTypes from 'prop-types'
import { Header, Grid } from 'semantic-ui-react'
import ParcelName from 'components/ParcelName'
import ParcelOwner from './ParcelOwner'
import ParcelActions from './ParcelActions'
import ParcelPublication from './ParcelPublication'
import ParcelDescription from './ParcelDescription'
import { parcelType, districtType } from 'components/types'
import { hasPublication, getDistrict } from 'lib/parcelUtils'

export default class ParcelDetail extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    districts: PropTypes.objectOf(districtType).isRequired,
    onBuy: PropTypes.func.isRequired
  }

  getDescription() {
    const { parcel, districts } = this.props
    const district = getDistrict(parcel, districts)

    if (district) {
      return district.description
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
      <Grid columns={2} stackable={true} className="ParcelDetail">
        <Grid.Row>
          <Grid.Column>
            <Header size="large">
              <ParcelName parcel={parcel} />
            </Header>
            <ParcelDescription description={description} />
          </Grid.Column>
          <Grid.Column className="parcel-owner-container">
            <ParcelOwner parcel={parcel} districts={districts} />
          </Grid.Column>
        </Grid.Row>
        {isOwner ? (
          <Grid.Row>
            <Grid.Column>
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
      </Grid>
    )
  }
}
