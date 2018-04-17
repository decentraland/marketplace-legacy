import React from 'react'
import { Header, Grid } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import ParcelName from 'components/ParcelName'
import Mana from 'components/Mana'
import PublicationExpiration from 'components/PublicationExpiration'
import ParcelOwner from './ParcelOwner'
import ParcelActions from './ParcelActions'
import ParcelDescription from './ParcelDescription'
import ParcelTransactionHistory from './ParcelTransactionHistory'
import ParcelTags from './ParcelTags'
import { parcelType, districtType, publicationType } from 'components/types'
import { hasPublication, getDistrict } from 'lib/parcelUtils'
import { t } from 'modules/translation/utils'

export default class ParcelDetail extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    publications: PropTypes.objectOf(publicationType),
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

  render() {
    const { parcel, districts, publications, isOwner } = this.props

    const description = this.getDescription()
    const publication = this.getPublication()

    return (
      <div className="ParcelDetail">
        <Grid columns={2} stackable>
          <Grid.Row className="parcel-detail-row">
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
          {publication || isOwner ? (
            <Grid.Row className="parcel-detail-row">
              {publication ? (
                <React.Fragment>
                  <Grid.Column width={4}>
                    <h3>{t('parcel_detail.publication.price')}</h3>
                    <Mana
                      amount={parseFloat(publication.price, 10)}
                      size={20}
                      className="mana-price-icon"
                    />
                  </Grid.Column>
                  <Grid.Column width={4} className="time-left">
                    <h3>{t('parcel_detail.publication.time_left')}</h3>
                    <PublicationExpiration publication={publication} />
                  </Grid.Column>
                </React.Fragment>
              ) : null}
              <Grid.Column
                className="parcel-actions-container"
                width={publication ? 8 : 16}
              >
                <ParcelActions parcel={parcel} isOwner={isOwner} />
              </Grid.Column>
            </Grid.Row>
          ) : null}
        </Grid>
        <ParcelTags parcel={parcel} districts={districts} />
        <ParcelTransactionHistory parcel={parcel} publications={publications} />
      </div>
    )
  }
}
