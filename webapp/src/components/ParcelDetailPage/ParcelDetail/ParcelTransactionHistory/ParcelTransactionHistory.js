import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Responsive } from 'semantic-ui-react'
import AddressBlock from 'components/AddressBlock'
import BlockDate from 'components/BlockDate'
import Mana from 'components/Mana'
import { parcelType, publicationType } from 'components/types'
import {
  PUBLICATION_STATUS,
  findParcelPublications
} from 'modules/publication/utils'
import { distanceInWordsToNow, shortenAddress } from 'lib/utils'
import { AUCTION_DATE } from 'lib/parcelUtils'
import { t } from 'modules/translation/utils'

import './ParcelTransactionHistory.css'

export default class ParcelTransactionHistory extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    publications: PropTypes.objectOf(publicationType)
  }

  getParcelPublications() {
    const { parcel, publications } = this.props
    return findParcelPublications(
      parcel,
      publications,
      PUBLICATION_STATUS.sold
    ).sort((a, b) => (a.block_number > b.block_number ? -1 : 1))
  }

  hasAuctionData() {
    const { parcel } = this.props
    return parcel.auction_price != null && parcel.auction_owner != null
  }

  renderAddress(address) {
    return (
      <div className="address-wrapper" title={address}>
        <AddressBlock address={address} scale={4} hasTooltip={false} />&nbsp;
        <span className="short-address">{shortenAddress(address)}</span>
      </div>
    )
  }

  render() {
    const { parcel } = this.props
    const parcelPublications = this.getParcelPublications()

    if (!this.hasAuctionData() && parcelPublications.length <= 0) {
      return null
    }

    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <Grid
              className="ParcelTransactionHistory parcel-detail-row"
              columns="equal"
            >
              <Grid.Row>
                <Grid.Column>
                  <h3>{t('parcel_detail.history.title')}</h3>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="transaction-history-header">
                <Grid.Column>{t('parcel_detail.history.price')}</Grid.Column>
                <Grid.Column>{t('parcel_detail.history.when')}</Grid.Column>
                <Responsive
                  as={Grid.Column}
                  minWidth={Responsive.onlyTablet.minWidth}
                >
                  {t('parcel_detail.history.from')}
                </Responsive>
                <Responsive
                  as={Grid.Column}
                  minWidth={Responsive.onlyTablet.minWidth}
                >
                  {t('parcel_detail.history.to')}
                </Responsive>
              </Grid.Row>

              {parcelPublications.map(publication => (
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

              {parcel.auction_price && parcel.auction_owner ? (
                <Grid.Row className="transaction-history-entry">
                  <Grid.Column>
                    <Mana amount={parcel.auction_price} />
                  </Grid.Column>
                  <Grid.Column>
                    {distanceInWordsToNow(AUCTION_DATE)}
                  </Grid.Column>
                  <Responsive
                    as={Grid.Column}
                    minWidth={Responsive.onlyTablet.minWidth}
                  >
                    {t('parcel_detail.history.auction')}
                  </Responsive>
                  <Responsive
                    as={Grid.Column}
                    minWidth={Responsive.onlyTablet.minWidth}
                  >
                    {this.renderAddress(parcel.auction_owner)}
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
