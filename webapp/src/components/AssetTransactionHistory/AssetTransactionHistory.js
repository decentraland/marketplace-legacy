import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Grid, Responsive } from 'semantic-ui-react'

import { locations } from 'locations'
import AddressBlock from 'components/AddressBlock'
import BlockDate from 'components/BlockDate'
import Mana from 'components/Mana'
import { assetType, publicationType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import { PUBLICATION_STATUS, findAssetPublications } from 'shared/publication'
import { AUCTION_DATE } from 'shared/parcel'
import { distanceInWordsToNow, shortenAddress } from 'lib/utils'

import './AssetTransactionHistory.css'

export default class AssetTransactionHistory extends React.PureComponent {
  static propTypes = {
    asset: assetType.isRequired,
    publications: PropTypes.objectOf(publicationType)
  }

  getAssetPublications() {
    const { asset, publications } = this.props
    return findAssetPublications(
      publications,
      asset,
      PUBLICATION_STATUS.sold
    ).sort((a, b) => (a.block_number > b.block_number ? -1 : 1))
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
            scale={4}
            hasTooltip={false}
            hasLink={false}
          />&nbsp;
          <span className="short-address">{shortenAddress(address)}</span>
        </Link>
      </div>
    )
  }

  render() {
    const { asset } = this.props
    const assetPublications = this.getAssetPublications()

    if (!this.hasAuctionData() && assetPublications.length === 0) {
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
                <Grid.Column>{t('asset_detail.history.price')}</Grid.Column>
                <Grid.Column>{t('asset_detail.history.when')}</Grid.Column>
                <Responsive
                  as={Grid.Column}
                  minWidth={Responsive.onlyTablet.minWidth}
                >
                  {t('asset_detail.history.from')}
                </Responsive>
                <Responsive
                  as={Grid.Column}
                  minWidth={Responsive.onlyTablet.minWidth}
                >
                  {t('asset_detail.history.to')}
                </Responsive>
              </Grid.Row>

              {assetPublications.map(publication => (
                <Grid.Row
                  key={publication.tx_hash}
                  className="transaction-history-entry"
                >
                  <Grid.Column>
                    <Mana amount={publication.price} />
                  </Grid.Column>
                  <Grid.Column>
                    <BlockDate
                      blockNumber={publication.block_number}
                      blockTime={
                        publication.block_time_updated_at ||
                        publication.block_time_created_at
                      }
                    />
                  </Grid.Column>
                  <Responsive
                    as={Grid.Column}
                    minWidth={Responsive.onlyTablet.minWidth}
                  >
                    {this.renderAddress(publication.owner)}
                  </Responsive>
                  <Responsive
                    as={Grid.Column}
                    minWidth={Responsive.onlyTablet.minWidth}
                  >
                    {this.renderAddress(publication.buyer)}
                  </Responsive>
                </Grid.Row>
              ))}

              {asset.auction_price && asset.auction_owner ? (
                <Grid.Row className="transaction-history-entry">
                  <Grid.Column>
                    <Mana amount={asset.auction_price} />
                  </Grid.Column>
                  <Grid.Column>
                    {distanceInWordsToNow(AUCTION_DATE)}
                  </Grid.Column>
                  <Responsive
                    as={Grid.Column}
                    minWidth={Responsive.onlyTablet.minWidth}
                  >
                    {t('asset_detail.history.auction')}
                  </Responsive>
                  <Responsive
                    as={Grid.Column}
                    minWidth={Responsive.onlyTablet.minWidth}
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
