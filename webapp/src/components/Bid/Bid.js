import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Grid, Responsive, Button, Icon } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { locations } from 'locations'
import { bidType, estateType } from 'components/types'
import { distanceInWordStrict, preventDefault } from 'lib/utils'
import { ASSET_TYPES } from 'shared/asset'
import { shortenOwner } from 'shared/map'
import { calculateMapProps } from 'shared/estate'
import { splitCoordinate } from 'shared/coordinates'
import AddressBlock from 'components/AddressBlock'
import Mana from 'components/Mana'
import ParcelPreview from 'components/ParcelPreview'

import './Bid.css'

const PREVIEW_SIZE = 76
const NUM_PARCELS = 7
const PARCEL_SIZE = PREVIEW_SIZE / NUM_PARCELS

export default class Bid extends React.PureComponent {
  static propTypes = {
    isOwner: PropTypes.bool.isRequired,
    bid: bidType.isRequired,
    estates: PropTypes.objectOf(estateType),
    className: PropTypes.string
  }

  static defaultProps = {
    showAssetDetail: false,
    className: ''
  }

  renderAssetPreview = () => {
    const { bid, estates } = this.props
    const { asset_id, asset_type } = bid
    let x, y, zoom, pan, selected
    switch (asset_type) {
      case ASSET_TYPES.parcel: {
        const coordinates = splitCoordinate(asset_id)
        x = coordinates[0]
        y = coordinates[1]
        selected = { x, y }
        break
      }
      case ASSET_TYPES.estate: {
        const estate = estates[asset_id]
        if (estate) {
          const mapProps = calculateMapProps(estate.data.parcels, PARCEL_SIZE)
          x = mapProps.center.x
          y = mapProps.center.y
          pan = mapProps.pan
          zoom = mapProps.zoom
          selected = estate.data.parcels
        }

        break
      }
    }

    return (
      <ParcelPreview
        x={x}
        y={y}
        width={PREVIEW_SIZE - 5}
        height={PREVIEW_SIZE}
        size={PARCEL_SIZE}
        selected={selected}
        zoom={zoom}
        panX={pan && pan.x}
        panY={pan && pan.y}
      />
    )
  }

  renderAssetData = () => {
    const { bid, estates } = this.props
    const { asset_id, asset_type } = bid

    switch (asset_type) {
      case ASSET_TYPES.parcel: {
        const [x, y] = splitCoordinate(asset_id)
        return (
          <React.Fragment>
            <Icon name="marker" />
            {x}, {y}
          </React.Fragment>
        )
      }
      case ASSET_TYPES.estate: {
        const estate = estates[asset_id]
        return <span>{estate ? estate.data.name : ''}</span>
      }
    }
  }

  getDetailLink = () => {
    const { asset_id, asset_type } = this.props.bid

    switch (asset_type) {
      case ASSET_TYPES.parcel: {
        const [x, y] = splitCoordinate(asset_id)
        return locations.parcelDetail(x, y)
      }
      case ASSET_TYPES.estate: {
        return locations.estateDetail(asset_id)
      }
      default:
        return null
    }
  }

  render() {
    const {
      bid,
      isOwner,
      onConfirm,
      onUpdate,
      showAssetDetail,
      className
    } = this.props
    const hasSameSellerAndBidder = bid.seller === bid.bidder
    const assetDetailLink = this.getDetailLink()
    return (
      <Grid
        stackable
        className={`Bid ${className} ${
          showAssetDetail ? 'showAssetDetail' : ''
        }`}
      >
        <Grid.Row>
          {showAssetDetail && (
            <React.Fragment>
              <Responsive
                className="asset-details"
                as={Grid.Column}
                minWidth={Responsive.onlyTablet.minWidth}
                width={4}
              >
                <React.Fragment>
                  <Link to={assetDetailLink}>{this.renderAssetPreview()}</Link>
                  <div>
                    <h3>{t('bid.bid_asset')}</h3>
                    <Link className="asset-name" to={assetDetailLink}>
                      {this.renderAssetData()}
                    </Link>
                  </div>
                </React.Fragment>
              </Responsive>
            </React.Fragment>
          )}
          {isOwner || !showAssetDetail ? (
            <Grid.Column width={3}>
              <h3>{t('global.from')}</h3>
              <div className="address-wrapper" title={bid.bidder}>
                <Link to={locations.profilePageDefault(bid.bidder)}>
                  <AddressBlock
                    address={bid.bidder}
                    scale={3.3}
                    hasTooltip={false}
                    hasLink={false}
                  />&nbsp;
                  <span className="short-address">
                    {hasSameSellerAndBidder
                      ? t('global.you')
                      : shortenOwner(bid.bidder)}
                  </span>
                </Link>
              </div>
            </Grid.Column>
          ) : null}
          <Grid.Column width={showAssetDetail ? 3 : 4}>
            <h3>{t('global.price')}</h3>
            <Mana
              amount={bid.price}
              size={15}
              scale={1}
              className="mortgage-amount-icon"
            />
          </Grid.Column>
          <Grid.Column width={showAssetDetail ? 3 : 3}>
            <h3>{t('global.time_left')}</h3>
            <p>{distanceInWordStrict(parseInt(bid.expires_at, 10))}</p>
          </Grid.Column>
          <Grid.Column
            width={isOwner && showAssetDetail ? 3 : 6}
            className={'actions'}
          >
            {!isOwner &&
              !hasSameSellerAndBidder && (
                <Button onClick={preventDefault(onUpdate)}>
                  {t('global.update')}
                </Button>
              )}
            <Button onClick={preventDefault(onConfirm)}>
              {!isOwner || hasSameSellerAndBidder
                ? t('global.cancel')
                : t('global.accept')}
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
