import React from 'react'
import PropTypes from 'prop-types'
import { Header, Grid, Responsive } from 'semantic-ui-react'
import ParcelName from 'components/ParcelName'
import Mana from 'components/Mana'
import AddressBlock from 'components/AddressBlock'
import BlockDate from 'components/BlockDate'
import PublicationExpiration from 'components/PublicationExpiration'
import ParcelOwner from './ParcelOwner'
import ParcelActions from './ParcelActions'
import ParcelDescription from './ParcelDescription'
import { parcelType, districtType, publicationType } from 'components/types'
import { hasPublication, getDistrict } from 'lib/parcelUtils'
import { PUBLICATION_STATUS } from 'modules/publication/utils'
import { distanceInWordsToNow, shortenAddress } from 'lib/utils'
import { t } from 'modules/translation/utils'

const auctionDate = distanceInWordsToNow('2018-01-31T00:00:00Z')

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

  renderTransactionHistory() {
    const { parcel, publications } = this.props
    const parcelPublications = Object.keys(publications)
      .map(tx_hash => publications[tx_hash])
      .filter(
        publication =>
          publication.x === parcel.x &&
          publication.y === parcel.y &&
          publication.status === PUBLICATION_STATUS.sold
      )
      .sort((a, b) => (a.block_number > b.block_number ? -1 : 1))
    const hasAuctionData =
      parcel.auction_price != null && parcel.auction_owner != null
    const hasPublications = parcelPublications.length > 0
    if (!hasAuctionData && !hasPublications) {
      return null
    }

    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <Grid
              className="transaction-history parcel-detail-row"
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
                    <BlockDate block={publication.block_number} />
                  </Grid.Column>
                  <Responsive
                    as={Grid.Column}
                    minWidth={Responsive.onlyTablet.minWidth}
                  >
                    <div className="address-wrapper">
                      <AddressBlock
                        address={publication.owner}
                        scale={4}
                        hasTooltip={false}
                      />&nbsp;
                      <span className="short-address" title={publication.owner}>
                        {shortenAddress(publication.owner)}
                      </span>
                    </div>
                  </Responsive>
                  <Responsive
                    as={Grid.Column}
                    minWidth={Responsive.onlyTablet.minWidth}
                  >
                    <div className="address-wrapper" title={publication.buyer}>
                      <AddressBlock
                        address={publication.buyer}
                        scale={4}
                        hasTooltip={false}
                      />&nbsp;
                      <span className="short-address">
                        {shortenAddress(publication.buyer)}
                      </span>
                    </div>
                  </Responsive>
                </Grid.Row>
              ))}
              {parcel.auction_price && parcel.auction_owner ? (
                <Grid.Row className="transaction-history-entry">
                  <Grid.Column>
                    <Mana amount={parcel.auction_price} />
                  </Grid.Column>
                  <Grid.Column>{auctionDate}</Grid.Column>
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
                    <div
                      className="address-wrapper"
                      title={parcel.auction_owner}
                    >
                      <AddressBlock
                        address={parcel.auction_owner}
                        scale={4}
                        hasTooltip={false}
                      />&nbsp;
                      <span className="short-address">
                        {shortenAddress(parcel.auction_owner)}
                      </span>
                    </div>
                  </Responsive>
                </Grid.Row>
              ) : null}
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  render() {
    const { parcel, districts, isOwner } = this.props

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
                className="parcel-actions"
                width={publication ? 8 : 16}
              >
                <ParcelActions parcel={parcel} isOwner={isOwner} />
              </Grid.Column>
            </Grid.Row>
          ) : null}
        </Grid>
        {this.renderTransactionHistory()}
      </div>
    )
  }
}
