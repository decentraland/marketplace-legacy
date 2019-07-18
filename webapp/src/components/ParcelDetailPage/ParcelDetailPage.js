import React from 'react'
import { Header, Grid } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { t } from '@dapps/modules/translation/utils'

import ParcelName from 'components/ParcelName'
import Mana from 'components/Mana'
import Expiration from 'components/Expiration'
import ParcelTags from 'components/ParcelTags'
import Bid from 'components/Bid'
import AssetTransactionHistory from 'components/AssetTransactionHistory'
import {
  parcelType,
  districtType,
  publicationType,
  mortgageType,
  walletType,
  estateType,
  bidType
} from 'components/types'
import { getOpenPublication } from 'modules/asset/utils'
import { ASSET_TYPES } from 'shared/asset'
import { getDistrict } from 'shared/district'
import { hasTags } from 'shared/parcel'
import { shouldShowBid } from 'shared/bid'
import ParcelOwner from './ParcelOwner'
import ParcelActions from './ParcelActions'
import ParcelDescription from './ParcelDescription'
import ParcelMortgage from './ParcelMortgage'

import './ParcelDetailPage.css'

export default class ParcelDetailPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType.isRequired,
    parcel: parcelType.isRequired,
    publications: PropTypes.objectOf(publicationType),
    estates: PropTypes.objectOf(estateType),
    districts: PropTypes.objectOf(districtType).isRequired,
    bids: PropTypes.arrayOf(bidType),
    mortgage: mortgageType,
    isOwner: PropTypes.bool.isRequired,
    onBuy: PropTypes.func.isRequired
  }

  getDescription() {
    const { parcel, districts } = this.props
    const district = getDistrict(parcel, districts)

    if (district) {
      return district.description
    }
    if (parcel.data.description) {
      return parcel.data.description.toString()
    }

    return ''
  }

  render() {
    const {
      wallet,
      parcel,
      publications,
      estates,
      districts,
      bids,
      mortgage,
      isOwner
    } = this.props

    const description = this.getDescription()
    const publication = getOpenPublication(parcel, publications)
    const bidsToShow = bids.filter(bid => shouldShowBid(bid, isOwner))

    return (
      <div className="ParcelDetailPage">
        <Grid columns={2} stackable>
          <Grid.Row className="parcel-detail-row">
            <Grid.Column>
              <Header size="large">
                <ParcelName parcel={parcel} />
              </Header>
              <ParcelDescription description={description} />
            </Grid.Column>
            <Grid.Column className="parcel-owner-container">
              <ParcelOwner
                wallet={wallet}
                parcel={parcel}
                estates={estates}
                districts={districts}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="parcel-detail-row">
            {publication ? (
              <React.Fragment>
                <Grid.Column mobile={4} tablet={3} computer={4}>
                  <h3>{t('global.price')}</h3>
                  <Mana
                    amount={parseFloat(publication.price)}
                    size={20}
                    className="mana-price-icon"
                  />
                </Grid.Column>
                <Grid.Column
                  mobile={4}
                  tablet={3}
                  computer={4}
                  className="time-left"
                >
                  <h3>{t('global.time_left')}</h3>
                  <Expiration
                    expiresAt={parseInt(publication.expires_at, 10)}
                    className={'PublicationExpiration'}
                  />
                </Grid.Column>
              </React.Fragment>
            ) : null}
            <Grid.Column
              className="parcel-actions-container"
              tablet={publication ? 10 : 16}
              computer={publication ? 8 : 16}
            >
              <ParcelActions
                wallet={wallet}
                parcel={parcel}
                bids={bids}
                publications={publications}
                hasMortgage={!!mortgage}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {bidsToShow &&
          bidsToShow.length > 0 && (
            <Grid stackable className="parcel-detail-row">
              <Grid.Row>
                <Grid.Column>
                  <h3>{t('asset_detail.bid.title')}</h3>
                  {bidsToShow.map(bid => <Bid key={bid.id} bid={bid} />)}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )}

        {mortgage && <ParcelMortgage mortgage={mortgage} />}

        {hasTags(parcel) && (
          <Grid stackable className="parcel-detail-row">
            <Grid.Row>
              <Grid.Column>
                <h3>{t('parcel_detail.tags.title')}</h3>
                <ParcelTags parcel={parcel} showDetails={true} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}

        <AssetTransactionHistory
          asset={parcel}
          assetType={ASSET_TYPES.parcel}
          publications={publications}
        />
      </div>
    )
  }
}
