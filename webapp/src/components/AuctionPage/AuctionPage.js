import React from 'react'
import PropTypes from 'prop-types'
import { eth, Contract } from 'decentraland-eth'
import { utils } from 'decentraland-commons'
import {
  Form,
  Message,
  Header,
  Grid,
  Container,
  Loader,
  Button,
  Icon
} from 'semantic-ui-react'
import { t, T } from '@dapps/modules/translation/utils'

import ParcelPreview from 'components/ParcelPreview'
import ParcelCoords from 'components/ParcelCoords'
import ParcelCoord from 'components/ParcelCoords/ParcelCoord'
import SignInNotice from 'components/SignInNotice'
import {
  authorizationType,
  auctionParamsType,
  walletType,
  tileType,
  coordsType
} from 'components/types'
import {
  TOKEN_SYMBOLS,
  TOKEN_MAX_CONVERSION_AMOUNT,
  AUCTION_HELPERS,
  hasSeenAuctionHelper,
  dismissAuctionHelper,
  getYoutubeTutorialId,
  addConversionFee,
  getConversionFeePercentage
} from 'modules/auction/utils'
import { preventDefault } from 'lib/utils'
import { isEqualCoords } from 'shared/parcel'
import { ASSET_TYPES } from 'shared/asset'
import { TYPES, COLORS } from 'shared/map'
import TokenDropdown from './TokenDropdown'
import Token from './Token'

const AUCTION_COLORS = {
  ...COLORS,
  unowned: COLORS.onSale,
  onSale: '#306D90'
}

import './AuctionPage.css'

const REFRESH_OWNERS_INTERVAL = 30000 // 30 seconds

export default class AuctionPage extends React.PureComponent {
  static propTypes = {
    isConnected: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    isAvailableParcelLoading: PropTypes.bool.isRequired,
    isRefreshingPrice: PropTypes.bool,
    authorization: authorizationType,
    params: auctionParamsType,
    center: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }).isRequired,
    wallet: walletType,
    tiles: PropTypes.objectOf(tileType),
    onShowAuctionModal: PropTypes.func.isRequired,
    onSetParcelOnChainOwner: PropTypes.func.isRequired,
    onFetchAvailableParcel: PropTypes.func.isRequired,
    onChangeAuctionCenterParcel: PropTypes.func.isRequired,
    onChangeCoords: PropTypes.func.isRequired,
    token: PropTypes.oneOf(TOKEN_SYMBOLS),
    rate: PropTypes.number,
    selectedCoordinatesById: PropTypes.objectOf(coordsType).isRequired,
    parcelOnChainOwners: PropTypes.objectOf(PropTypes.string).isRequired
  }

  constructor(props) {
    super(props)

    this.mounted = false
    this.timoutId = null

    this.state = {
      showTokenTooltip: !hasSeenAuctionHelper(
        AUCTION_HELPERS.SEEN_AUCTION_TOKEN_TOOLTIP
      ),
      toggle: false,
      refreshingParcelId: null
    }
  }

  componentWillMount() {
    const { isConnected } = this.props
    this.mounted = true
    if (isConnected) {
      this.handleConnect()
    }
  }

  getColors = () => {
    return AUCTION_COLORS
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isConnected && nextProps.isConnected) {
      this.handleConnect()
    }
  }

  componentWillUnmount() {
    this.mounted = false
    if (this.timoutId != null) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  handleConnect() {
    this.showAuctionModal(this.props)
    // bye bye estella fugaz
    // this.updateSelectionOwners()
    if (this.getSelectedParcels().length === 0) {
      this.props.onFetchAvailableParcel()
    }
  }

  showAuctionModal(props) {
    const { onShowAuctionModal } = props

    if (!hasSeenAuctionHelper(AUCTION_HELPERS.SEEN_AUCTION_MODAL)) {
      onShowAuctionModal()
    }
  }

  handleSelectUnownedParcel = async ({ id, x, y, type, owner, assetType }) => {
    if (
      assetType !== ASSET_TYPES.parcel ||
      [TYPES.district, TYPES.contribution].includes(type)
    )
      return

    // if it has an owner, remove it from selection
    if (owner != null) {
      this.setState({
        selectedCoordinatesById: this.buildNewSelectionCoordsWithoutParcel(id)
      })
      return
    }

    const asset = { id, x, y } // {id, x, y} are enough props for the asset interface here

    this.updateOwner(asset)

    const wasOverLimit = this.hasReachedParcelLimit(
      this.props.selectedCoordinatesById
    )
    const newSelectedCoordsById = this.buildNewSelectedCoords(asset)
    const isOverLimit = this.hasReachedParcelLimit(newSelectedCoordsById)

    if (!wasOverLimit || (wasOverLimit && !isOverLimit)) {
      this.props.onChangeCoords(newSelectedCoordsById)
    }
  }

  handleDeselectUnownedParcel = parcel => {
    const newSelectedCoordsById = this.buildNewSelectedCoords(parcel)
    this.props.onChangeCoords(newSelectedCoordsById)
  }

  handleFindAvailableParcel = () => {
    this.props.onFetchAvailableParcel()
  }

  handleParcelClick = parcel => {
    const { center, onChangeAuctionCenterParcel } = this.props
    if (!isEqualCoords(parcel, center)) {
      onChangeAuctionCenterParcel(parcel)
    }
  }

  handleSubmit = () => {
    const { wallet, onSubmit } = this.props
    onSubmit(this.getSelectedParcels(), wallet.address)
  }

  handleCloseTooltip = () => {
    if (this.state.showTokenTooltip) {
      dismissAuctionHelper(AUCTION_HELPERS.SEEN_AUCTION_TOKEN_TOOLTIP)
      this.setState({ showTokenTooltip: false })
    }
  }

  handleChangeToken = token => {
    this.handleCloseTooltip()
    this.props.onFetchAuctionRate(token)
  }

  updateOwner = async parcel => {
    return this.getParcelOwnerOnChain(parcel).then(ownerOnChain => {
      if (!Contract.isEmptyAddress(ownerOnChain)) {
        this.props.onSetParcelOnChainOwner(parcel.id, ownerOnChain)
      }
    })
  }

  async getParcelOwnerOnChain(parcel) {
    // WARN: this code is duplicated on shared/asset.js. It's the same as calling:
    //   `await getAssetOwnerOnChain(ASSET_TYPE.parcel, parcel)`
    // It's repeated here because if we try to use `eth` on shared/ from webapp/ it won't work because
    // it'll try to use the singleton from the parent folder.
    // Fixing this is a issue on it's own so we'll leave this code here for now.
    const landRegistry = eth.getContract('LANDRegistry')
    return landRegistry.ownerOfLand(parcel.x, parcel.y)
  }

  updateSelectionOwners = async () => {
    const selectedParcels = this.getSelectedParcels()
    for (const parcel of selectedParcels) {
      this.setState({ refreshingParcelId: parcel.id })
      await this.updateOwner(parcel)
    }
    this.setState({ refreshingParcelId: null })
    this.timoutId = setTimeout(() => {
      if (!this.mounted) return
      this.updateSelectionOwners()
    }, REFRESH_OWNERS_INTERVAL)
  }

  buildNewSelectedCoords(parcel) {
    const { selectedCoordinatesById } = this.props
    const { id, x, y } = parcel
    const isSelected = selectedCoordinatesById[id] !== undefined

    return isSelected
      ? utils.omit(selectedCoordinatesById, id)
      : { ...selectedCoordinatesById, [id]: { x, y } }
  }

  buildNewSelectionCoordsWithoutParcel(parcelId) {
    const { selectedCoordinatesById } = this.props
    return utils.omit(selectedCoordinatesById, parcelId)
  }

  hasReachedParcelLimit(selected) {
    const { tiles, params } = this.props
    const { landsLimitPerBid } = params
    return (
      Object.keys(selected).filter(parcelId => tiles[parcelId].owner == null)
        .length >= landsLimitPerBid
    )
  }

  getSelectedParcels() {
    const { tiles, selectedCoordinatesById } = this.props

    if (!tiles) return []

    const parcelIds = Object.keys(selectedCoordinatesById)
    const parcels = []

    for (const parcelId of parcelIds) {
      const tile = tiles[parcelId]
      if (tile) {
        parcels.push({ id: parcelId, ...tile })
      }
    }

    return parcels
  }

  roundPrice = price => {
    return this.isToken('MKR') ? parseFloat(price) : Math.round(price)
  }

  isToken(token) {
    return this.props.token === token
  }

  handleToggle = () => {
    this.setState({ toggle: !this.state.toggle })
  }

  handleRefreshPrice = async () => {
    const { isRefreshingPrice, onFetchAuctionPrice } = this.props
    if (!isRefreshingPrice) {
      onFetchAuctionPrice()
    }
  }

  render() {
    const {
      authorization,
      params,
      center,
      tiles,
      token,
      rate,
      price,
      selectedCoordinatesById,
      isConnecting,
      isConnected,
      isAvailableParcelLoading,
      isRefreshingPrice
    } = this.props

    const { showTokenTooltip } = this.state
    const { availableParcelCount, landsLimitPerBid, gasPriceLimit } = params
    const { x, y } = center

    if (!isConnecting && !isConnected) {
      return (
        <div>
          <SignInNotice />
        </div>
      )
    }

    if (!authorization || price == null || x == null) {
      return (
        <div>
          <Loader active size="massive" />
        </div>
      )
    }

    const isFetchingRate = rate == null

    const selectedParcels = this.getSelectedParcels()
    const validSelectedParcels = selectedParcels.filter(
      parcel => parcel.owner == null
    )

    const landPrice = this.roundPrice(price * rate)
    const landPriceInMana = Math.round(price)

    const totalPriceInMana = Math.round(price * validSelectedParcels.length)
    let totalPrice = this.roundPrice(totalPriceInMana * rate)

    const hasConversionFees = !this.isToken('MANA')

    if (hasConversionFees) {
      totalPrice = Math.round(addConversionFee(totalPrice))
    }

    const canConvert =
      !hasConversionFees ||
      (price <= TOKEN_MAX_CONVERSION_AMOUNT[token] && rate > 0) ||
      rate > 0

    let auctionMenuClasses = 'auction-menu'
    if (this.state.toggle) {
      auctionMenuClasses += ' open'
    }

    const shouldShowFootnote =
      validSelectedParcels.length > 0 && hasConversionFees

    return (
      <div className="AuctionPage">
        <div className="parcel-preview">
          <ParcelPreview
            x={x}
            y={y}
            tiles={tiles}
            selected={validSelectedParcels}
            isDraggable
            showPopup
            showControls={false}
            showMinimap={true}
            onClick={this.handleSelectUnownedParcel}
            getColors={this.getColors}
          />
        </div>

        <Container className={auctionMenuClasses}>
          <Grid className="auction-details">
            <Grid.Row>
              <Grid.Column mobile={16} computer={5}>
                <Header size="large" onClick={this.handleToggle}>
                  <span>
                    {t('auction_page.title')}{' '}
                    {validSelectedParcels.length > 0 ? (
                      <span className="parcel-count">
                        &nbsp;({validSelectedParcels.length}){' '}
                        {this.hasReachedParcelLimit(selectedCoordinatesById) ? (
                          <Icon name="warning sign" size="small" />
                        ) : null}
                      </span>
                    ) : null}
                  </span>
                  <Icon name="chevron down" />
                </Header>
                <p className="subtitle description">
                  {t('auction_page.description')}
                </p>
              </Grid.Column>

              <Grid.Column
                mobile={16}
                computer={11}
                className="auction-actions"
              >
                <Form onSubmit={preventDefault(this.handleSubmit)}>
                  <div className="information-blocks">
                    <div className="input-information">
                      <div className="information-block token">
                        {showTokenTooltip && (
                          <div className="ui pointing below label">
                            {t('auction_page.token_tooltip')}
                            <i
                              className="icon close"
                              onClick={this.handleCloseTooltip}
                            />
                          </div>
                        )}
                        <p className="subtitle">{t('auction_page.token')}</p>
                        <TokenDropdown
                          token={token}
                          onChange={this.handleChangeToken}
                        />
                      </div>
                      <div className="information-block">
                        <p className="subtitle">{t('auction_page.parcels')}</p>
                        <Header size="large">
                          {validSelectedParcels.length}
                          <span className="secondary">
                            &nbsp;
                            <span
                              className="tooltip"
                              data-balloon-pos="up"
                              data-balloon={t('auction_page.parcels_tooltip', {
                                max: landsLimitPerBid
                              })}
                            >
                              <Icon size="small" name="question circle" />
                            </span>
                          </span>
                        </Header>
                      </div>
                      <div className="information-block">
                        <p className="subtitle">
                          {t('auction_page.land_price')}
                        </p>
                        <Token
                          loading={isFetchingRate}
                          symbol={token}
                          amount={landPrice.toLocaleString()}
                        >
                          <span className="secondary">
                            &nbsp;
                            <span
                              className="tooltip"
                              data-balloon-pos="up"
                              data-balloon={t('auction_page.refresh')}
                            >
                              <Icon
                                loading={isRefreshingPrice}
                                size="small"
                                name="refresh"
                                onClick={this.handleRefreshPrice}
                              />
                            </span>
                          </span>
                        </Token>
                      </div>
                    </div>
                    <div className="output-information">
                      <div className="information-block">
                        <p className="subtitle">
                          {t('auction_page.total_price')}
                          {shouldShowFootnote ? ' *' : null}
                        </p>
                        <Token
                          loading={isFetchingRate}
                          symbol={token}
                          amount={totalPrice.toLocaleString()}
                        />
                      </div>
                      <div className="information-block">
                        <Button
                          type="submit"
                          primary={true}
                          disabled={
                            validSelectedParcels.length === 0 ||
                            isFetchingRate ||
                            !canConvert
                          }
                        >
                          {isFetchingRate ? (
                            <span>{t('global.loading')}&hellip;</span>
                          ) : (
                            t('auction_page.bid')
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              </Grid.Column>
              {shouldShowFootnote ? (
                <Grid.Column width={16}>
                  <div className="disclaimer">
                    {canConvert
                      ? t('auction_page.conversion_disclaimer', {
                          fee: getConversionFeePercentage()
                        })
                      : t('auction_page.max_amount_disclaimer', {
                          amount: (
                            totalPriceInMana || landPriceInMana
                          ).toLocaleString(),
                          token
                        })}
                  </div>
                </Grid.Column>
              ) : null}
            </Grid.Row>

            {this.hasReachedParcelLimit(selectedCoordinatesById) ? (
              <Grid.Row>
                <Grid.Column width={16}>
                  <Message
                    warning
                    icon="warning sign"
                    header={t('auction_page.maximum_parcels_title')}
                    content={t('auction_page.maximum_parcels_message', {
                      max: landsLimitPerBid
                    })}
                  />
                </Grid.Column>
              </Grid.Row>
            ) : null}

            <Grid.Row>
              <Grid.Column width={16}>
                <div className="auction-panel">
                  {selectedParcels.length > 0 ? (
                    <ParcelCoords isCollapsable={false}>
                      {selectedParcels.map(parcel => (
                        <ParcelCoord
                          key={parcel.id}
                          parcel={parcel}
                          isLoading={
                            this.state.refreshingParcelId === parcel.id
                          }
                          onClick={this.handleParcelClick}
                          onDelete={this.handleDeselectUnownedParcel}
                          status={
                            Contract.isEmptyAddress(parcel.owner)
                              ? ''
                              : t('auction_page.sold')
                          }
                        />
                      ))}
                    </ParcelCoords>
                  ) : (
                    <div className="empty-parcels-message">
                      <T
                        id="auction_page.empty_message"
                        values={{
                          video_tutorial_link: (
                            <a
                              href={`https://www.youtube.com/watch?v=${getYoutubeTutorialId()}`}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {t('auction_page.video_tutorial')}
                            </a>
                          ),
                          blog_post_link: (
                            <a
                              href="https://decentraland.org/blog/technology/how-will-the-land-auction-work"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {t('auction_page.blog_post')}
                            </a>
                          )
                        }}
                      />
                    </div>
                  )}

                  {availableParcelCount > 0 ? (
                    <footer>
                      <div className="footer-left">
                        <span className="available-parcels">
                          {availableParcelCount}{' '}
                          {t('auction_page.available_parcels')}
                        </span>
                        <span
                          className="link"
                          onClick={this.handleFindAvailableParcel}
                        >
                          {isAvailableParcelLoading
                            ? t('auction_page.searching')
                            : t('auction_page.find_available_parcel')}
                        </span>
                      </div>
                      <div className="footer-right">
                        {t('auction_page.gas_price')}: {gasPriceLimit} Gwei
                      </div>
                    </footer>
                  ) : null}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    )
  }
}
