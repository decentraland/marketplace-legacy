import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Grid, Responsive } from 'semantic-ui-react'

import { locations } from 'locations'
import AddressBlock from 'components/AddressBlock'
import BlockDate from 'components/BlockDate'
import Mana from 'components/Mana'
import { assetType, publicationType, bidType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import {
  normalizePublications,
  normalizeBids,
  sortListings,
  LISTING_STATUS,
  LISTING_TYPES
} from 'shared/listing'
import { shortenOwner } from 'shared/map'
import { findAssetPublications } from 'shared/publication'
import { distanceInWordsToNow } from 'lib/utils'

import './AssetTransactionHistory.css'

export default class AssetTransactionHistory extends React.PureComponent {
  static propTypes = {
    asset: assetType.isRequired,
    publications: PropTypes.objectOf(publicationType),
    bids: PropTypes.arrayOf(bidType)
  }

  componentWillMount() {
    this.props.onFetchAssetTransactionHistory()
  }

  getAssetListings() {
    const { asset, publications, bids } = this.props
    const assetPublications = findAssetPublications(
      publications,
      asset,
      LISTING_STATUS.sold
    )

    const normalizedPublications = normalizePublications(assetPublications)
    const normalizedBids = normalizeBids(bids)
    return sortListings(normalizedPublications.concat(normalizedBids))
  }

  hasAuctionData() {
    const { asset } = this.props
    return asset.auction_price != null && asset.auction_owner != null
  }

  renderAddress(address) {
    return (
      <div className="address-wrapper" title={address}>
        <Link to={locations.profilePageDefault(address)}>
          <AddressBlock
            address={address}
            scale={3.4}
            hasTooltip={false}
            hasLink={false}
          />&nbsp;
          <span className="short-address">{shortenOwner(address)}</span>
        </Link>
      </div>
    )
  }

  render() {
    const { asset } = this.props
    const assetListings = this.getAssetListings()

    if (!this.hasAuctionData() && assetListings.length === 0) {
      return null
    }

    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <Grid
              className="AssetTransactionHistory asset-detail-row"
              columns="equal"
            >
              <Grid.Row>
                <Grid.Column>
                  <h3>{t('asset_detail.history.title')}</h3>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="transaction-history-header">
                <Grid.Column computer={3} tablet={3} mobile={4}>
                  {t('global.type')}
                </Grid.Column>
                <Grid.Column computer={3} tablet={3} mobile={6}>
                  {t('global.price')}
                </Grid.Column>
                <Grid.Column computer={4} tablet={4} mobile={6}>
                  {t('asset_detail.history.when')}
                </Grid.Column>
                <Responsive
                  as={Grid.Column}
                  minWidth={Responsive.onlyTablet.minWidth}
                  width={3}
                >
                  {t('global.from')}
                </Responsive>
                <Responsive
                  as={Grid.Column}
                  minWidth={Responsive.onlyTablet.minWidth}
                  width={3}
                >
                  {t('asset_detail.history.to')}
                </Responsive>
              </Grid.Row>

              {assetListings.map(listing => (
                <Grid.Row
                  key={listing.id}
                  className="transaction-history-entry"
                >
                  <Grid.Column computer={3} tablet={3} mobile={4}>
                    <p className="type">{listing.type}</p>
                  </Grid.Column>
                  <Grid.Column computer={3} tablet={3} mobile={6}>
                    <Mana amount={listing.price} />
                  </Grid.Column>
                  <Grid.Column computer={4} tablet={4} mobile={6}>
                    <BlockDate
                      blockNumber={listing.block_number}
                      blockTime={
                        listing.block_time_updated_at ||
                        listing.block_time_created_at
                      }
                    />
                  </Grid.Column>
                  <Responsive
                    as={Grid.Column}
                    minWidth={Responsive.onlyTablet.minWidth}
                    width={3}
                  >
                    {this.renderAddress(listing.from)}
                  </Responsive>
                  <Responsive
                    as={Grid.Column}
                    minWidth={Responsive.onlyTablet.minWidth}
                    width={3}
                  >
                    {this.renderAddress(listing.to)}
                  </Responsive>
                </Grid.Row>
              ))}

              {this.hasAuctionData() ? (
                <Grid.Row className="transaction-history-entry">
                  <Grid.Column computer={3} tablet={3} mobile={4}>
                    <p className="type">{LISTING_TYPES.AUCTION}</p>
                  </Grid.Column>
                  <Grid.Column computer={3} tablet={3} mobile={6}>
                    <Mana amount={asset.auction_price} />
                  </Grid.Column>
                  <Grid.Column computer={4} tablet={4} mobile={6}>
                    {distanceInWordsToNow(
                      parseInt(asset.auction_timestamp, 10)
                    )}
                  </Grid.Column>
                  <Responsive
                    as={Grid.Column}
                    minWidth={Responsive.onlyTablet.minWidth}
                    width={3}
                  >
                    {t('asset_detail.history.auction')}
                  </Responsive>
                  <Responsive
                    as={Grid.Column}
                    minWidth={Responsive.onlyTablet.minWidth}
                    width={3}
                  >
                    {this.renderAddress(asset.auction_owner)}
                  </Responsive>
                </Grid.Row>
              ) : null}
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
