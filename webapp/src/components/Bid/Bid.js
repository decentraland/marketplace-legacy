import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Grid, Button, Icon } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { locations } from 'locations'
import { bidType, estateType } from 'components/types'
import { distanceInWordStrict, preventDefault } from 'lib/utils'
import { ASSET_TYPES } from 'shared/asset'
import { shortenOwner } from 'shared/map'
import { calculateMapProps } from 'shared/estate'
import { splitCoordinate } from 'shared/coordinates'
import { fingerprintHasChanged } from 'shared/bid'
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

  getAssetTypeTitle = () => {
    switch (this.props.bid.asset_type) {
      case ASSET_TYPES.parcel: {
        return t('name.parcel')
      }
      case ASSET_TYPES.estate: {
        return t('name.estate')
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
    const fingerprintChanged = fingerprintHasChanged(bid)
    const assetDetailLink = this.getDetailLink()
    const sizeByResolution = {
      computer: showAssetDetail ? 4 : 3,
      tablet: showAssetDetail ? 4 : 3,
      mobile: showAssetDetail ? 8 : 16
    }

    let gridClassName = `Bid ${className}`
    gridClassName += showAssetDetail ? ' showAssetDetail' : ''
    gridClassName += fingerprintChanged ? ' fingerprint-changed' : ''

    return (
      <Grid stackable className={gridClassName}>
        <Grid.Row>
          {showAssetDetail && (
            <React.Fragment>
              <Grid.Column className="asset-details" width={3}>
                <Link to={assetDetailLink}>{this.renderAssetPreview()}</Link>
              </Grid.Column>
            </React.Fragment>
          )}
          <Grid.Column width={showAssetDetail ? 13 : 16}>
            <Grid className="inner-grid">
              {showAssetDetail && (
                <Grid.Column computer={4} tablet={4} mobile={8}>
                  <h3>{this.getAssetTypeTitle()}</h3>
                  <Link className="asset-name" to={assetDetailLink}>
                    {this.renderAssetData()}
                  </Link>
                </Grid.Column>
              )}
              {isOwner || !showAssetDetail ? (
                <Grid.Column {...sizeByResolution}>
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
              <Grid.Column {...sizeByResolution}>
                <h3>{t('global.price')}</h3>
                <Mana
                  amount={Math.floor(bid.price)}
                  size={15}
                  scale={1}
                  className="mortgage-amount-icon"
                />
              </Grid.Column>
              <Grid.Column {...sizeByResolution}>
                <h3>{t('global.time_left')}</h3>
                <p>{distanceInWordStrict(parseInt(bid.expires_at, 10))}</p>
              </Grid.Column>
              <Grid.Column
                computer={showAssetDetail ? 16 : 7}
                tablet={showAssetDetail ? 16 : 7}
                mobile={16}
                className={'actions'}
              >
                <Button
                  className={`${isOwner ? 'primary' : ''}`}
                  onClick={preventDefault(onConfirm)}
                >
                  {!isOwner || hasSameSellerAndBidder
                    ? t('global.cancel')
                    : t('global.accept')}
                </Button>
                {!isOwner &&
                  !hasSameSellerAndBidder &&
                  !fingerprintChanged && (
                    <Button
                      className="primary"
                      onClick={preventDefault(onUpdate)}
                    >
                      {t('global.update')}
                    </Button>
                  )}
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid.Row>
        {!isOwner &&
          fingerprintChanged && (
            <Grid.Row className="fingerprint-changed">
              <Grid.Column>
                <p>
                  {t('asset_bid.fingerprint_changed', {
                    asset_name: t('name.estate')
                  })}
                </p>
              </Grid.Column>
            </Grid.Row>
          )}
      </Grid>
    )
  }
}
