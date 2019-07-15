import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Icon, Header, Grid, Button } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { locations } from 'locations'
import { getOpenPublication } from 'modules/asset/utils'
import { ASSET_TYPES } from 'shared/asset'
import { hasTags } from 'shared/parcel'
import { calculateMapProps } from 'shared/estate'
import { buildCoordinate } from 'shared/coordinates'
import { isDistrict } from 'shared/district'
import { shouldShowBid } from 'shared/bid'
import {
  estateType,
  publicationType,
  bidType,
  walletType
} from 'components/types'
import ParcelTags from 'components/ParcelTags'
import ParcelCoords from 'components/ParcelCoords'
import AddressBlock from 'components/AddressBlock'
import Mana from 'components/Mana'
import Expiration from 'components/Expiration'
import LandAmount from 'components/LandAmount'
import Bid from 'components/Bid'
import AssetTransactionHistory from 'components/AssetTransactionHistory'
import EstateActions from './EstateActions'

import './EstateDetailPage.css'

const WITH_ACTION_BUTTONS_WIDTH = 8
const WITHOUT_ACTION_BUTTONS_WIDTH = 16

export default class EstateDetailPage extends React.PureComponent {
  // We also have a 'tiles' prop which is an object of 'tilesType'. We don't check it here because it takes up to 6 seconds
  static propTypes = {
    estate: estateType.isRequired,
    publications: PropTypes.objectOf(publicationType).isRequired,
    isOwner: PropTypes.bool.isRequired,
    onEditParcels: PropTypes.func.isRequired,
    onEditMetadata: PropTypes.func.isRequired,
    onManageEstate: PropTypes.func.isRequired,
    onParcelClick: PropTypes.func.isRequired,
    bids: PropTypes.arrayOf(bidType),
    wallet: walletType
  }

  getEstateParcels() {
    const { estate, tiles } = this.props
    const parcels = []

    for (const { x, y } of estate.data.parcels) {
      const parcelId = buildCoordinate(x, y)
      const tile = tiles[parcelId]
      if (tile) {
        parcels.push({ id: parcelId, x: tile.x, y: tile.y })
      }
    }
    return parcels
  }

  renderEmptyEstate() {
    const { estate } = this.props
    return (
      <div className="EstateDetailPage empty">
        <span className="empty-estate-message">
          {t('estate_detail.empty_estate', { name: estate.data.name })}
        </span>
      </div>
    )
  }

  render() {
    const {
      estate,
      publications,
      tiles,
      isOwner,
      onEditParcels,
      onEditMetadata,
      onManageEstate,
      onParcelClick,
      bids,
      wallet
    } = this.props

    if (estate.data.parcels.length === 0) {
      return this.renderEmptyEstate()
    }

    const publication = getOpenPublication(estate, publications)
    const { center } = calculateMapProps(estate.data.parcels)
    const bidsToShow = bids.filter(bid => shouldShowBid(bid, isOwner))

    return (
      <div className="EstateDetailPage">
        <Grid className="details" stackable>
          <Grid.Row>
            <Grid.Column
              computer={WITH_ACTION_BUTTONS_WIDTH}
              mobile={WITHOUT_ACTION_BUTTONS_WIDTH}
              className="estate-data"
            >
              <Header size="large">
                <p className="estate-title">
                  <span>{estate.data.name || t('estate_select.detail')}</span>
                  <Link
                    to={locations.parcelMapDetail(
                      center.x,
                      center.y,
                      estate.id
                    )}
                  >
                    <LandAmount value={estate.data.parcels.length} />
                  </Link>
                </p>
                {estate.data.description && (
                  <p className="estate-description">
                    {estate.data.description}
                  </p>
                )}
              </Header>
            </Grid.Column>
            {!isDistrict(estate) && (
              <Grid.Column
                computer={WITH_ACTION_BUTTONS_WIDTH}
                mobile={WITHOUT_ACTION_BUTTONS_WIDTH}
                className="estate-owner-container"
              >
                {isOwner ? (
                  <div>
                    <Button
                      size="tiny"
                      className="link"
                      onClick={onEditMetadata}
                    >
                      <Icon name="pencil" />
                      {t('global.edit')}
                    </Button>
                    <Button
                      size="tiny"
                      className="link manage-button"
                      onClick={onManageEstate}
                    >
                      <Icon name="add user" />
                      {t('asset_detail.actions.permissions')}
                    </Button>
                  </div>
                ) : (
                  <span className="owned-by">
                    <span>{t('global.owned_by')}</span>
                    <AddressBlock address={estate.owner} scale={4} />
                  </span>
                )}
              </Grid.Column>
            )}
          </Grid.Row>
          <Grid.Row>
            {publication && (
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
            )}
            <Grid.Column
              className="estate-actions-container"
              tablet={
                publication
                  ? WITH_ACTION_BUTTONS_WIDTH + 2
                  : WITHOUT_ACTION_BUTTONS_WIDTH
              }
              computer={
                publication
                  ? WITH_ACTION_BUTTONS_WIDTH
                  : WITHOUT_ACTION_BUTTONS_WIDTH
              }
            >
              <EstateActions
                wallet={wallet}
                isOwner={isOwner}
                publications={publications}
                estate={estate}
                bids={bidsToShow}
              />
            </Grid.Column>
          </Grid.Row>

          {bidsToShow &&
            bidsToShow.length > 0 && (
              <Grid.Row>
                <Grid.Column>
                  <h3>{t('asset_detail.bid.title')}</h3>
                  {bidsToShow.map(bid => (
                    <Bid key={bid.id} bid={bid} isOwner={isOwner} />
                  ))}
                </Grid.Column>
              </Grid.Row>
            )}

          {estate.parcels.filter(hasTags).length > 0 && (
            <Grid.Row>
              <Grid.Column className="highlights">
                <h3>{t('parcel_detail.tags.title')}</h3>
                <ParcelTags estate={estate} showDetails={true} />
              </Grid.Column>
            </Grid.Row>
          )}
          <Grid.Row>
            {tiles && (
              <React.Fragment>
                <Grid.Column
                  computer={
                    isOwner
                      ? WITH_ACTION_BUTTONS_WIDTH
                      : WITHOUT_ACTION_BUTTONS_WIDTH
                  }
                  mobile={WITHOUT_ACTION_BUTTONS_WIDTH}
                >
                  <h3>
                    {t('estate_detail.parcels')}
                    {isOwner && (
                      <Button
                        size="tiny"
                        className="link"
                        onClick={onEditParcels}
                      >
                        <Icon name="pencil" />
                        {t('estate_detail.edit_parcels')}{' '}
                      </Button>
                    )}
                  </h3>
                </Grid.Column>
                <Grid.Column width={WITHOUT_ACTION_BUTTONS_WIDTH}>
                  <ParcelCoords
                    parcels={this.getEstateParcels()}
                    onClick={onParcelClick}
                  />
                </Grid.Column>
              </React.Fragment>
            )}
          </Grid.Row>
        </Grid>
        <AssetTransactionHistory
          asset={{ ...estate, type: ASSET_TYPES.estate }}
          publications={publications}
        />
      </div>
    )
  }
}
