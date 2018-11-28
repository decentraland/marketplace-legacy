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
  parcelType,
  coordsType
} from 'components/types'
import {
  hasSeenAuctionHelper,
  TOKEN_SYMBOLS,
  AUCTION_HELPERS,
  dismissAuctionHelper,
  getVideoTutorialLink
} from 'modules/auction/utils'
import { isEqualCoords, isParcel } from 'shared/parcel'
import { preventDefault } from 'lib/utils'
import TokenDropdown from './TokenDropdown'
import Token from './Token'

import './AuctionPage.css'

const REFRESH_OWNERS_INTERVAL = 10000 // 10 seconds

export default class AuctionPage extends React.PureComponent {
  static propTypes = {
    isConnected: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    isAvailableParcelLoading: PropTypes.bool.isRequired,
    authorization: authorizationType,
    params: auctionParamsType,
    center: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }).isRequired,
    wallet: walletType,
    allParcels: PropTypes.objectOf(parcelType),
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

    this.hasFetchedParams = false
    this.mounted = false
    this.timoutId = null

    this.state = {
      showTokenTooltip: !hasSeenAuctionHelper(
        AUCTION_HELPERS.SEEN_AUCTION_TOKEN_TOOLTIP
      ),
      toggle: false
    }
  }

  componentWillMount() {
    const { onFetchAvailableParcel, isConnected } = this.props
    if (this.getSelectedParcels().length === 0) {
      onFetchAvailableParcel()
    }

    if (isConnected) {
      this.showAuctionModal(this.props)
    }

    this.mounted = true
    this.updateSelectionOwners()
  }

  componentWillUnmount() {
    this.mounted = false
    if (this.timoutId != null) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isConnected && !nextProps.modal.open) {
      this.showAuctionModal(nextProps)
    }
  }

  showAuctionModal(props) {
    const { onShowAuctionModal } = props

    if (!hasSeenAuctionHelper(AUCTION_HELPERS.SEEN_AUCTION_MODAL)) {
      onShowAuctionModal()
    }
  }

  handleSelectUnownedParcel = async ({ asset }) => {
    if (!isParcel(asset) || asset.district_id != null) return

    // if it has an owner, remove it from selection
    if (asset.owner != null) {
      this.setState({
        selectedCoordinatesById: this.buildNewSelectionCoordsWithoutParcel(
          asset
        )
      })
      return
    }

    this.updateOwner(asset)

    const wasOverLimit = this.hasReachedLimit(
      this.props.selectedCoordinatesById
    )
    const newSelectedCoordsById = this.buildNewSelectedCoords(asset)
    const isOverLimit = this.hasReachedLimit(newSelectedCoordsById)

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
    this.props.onChangeToken(token)
  }

  async getParcelOwnerOnChain(parcel) {
    // WARN: this code is duplicated on shared/asset.js. It's the same as calling:
    //   `await getAssetOwnerOnChain(ASSET_TYPE.parcel, parcel)`
    // It's repeated here because if we try to use `eth` on shared/ from webapp/ it won't work because
    // it'll try to use the singleton from the parent folder.
    // Fixing this is a issue on it's own so we'll leave this code here for now.
    const landRegistry = eth.getContract('LANDRegistry')
    const tokenId = await landRegistry.encodeTokenId(parcel.x, parcel.y)
    return landRegistry.ownerOf(tokenId)
  }

  updateOwner = async parcel => {
    return this.getParcelOwnerOnChain(parcel).then(ownerOnChain => {
      if (!Contract.isEmptyAddress(ownerOnChain)) {
        this.props.onSetParcelOnChainOwner(parcel.id, ownerOnChain)
      }
    })
  }

  updateSelectionOwners = async () => {
    await Promise.all(this.getSelectedParcels().map(this.updateOwner))
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

  buildNewSelectionCoordsWithoutParcel(parcel) {
    const { selectedCoordinatesById } = this.props
    return utils.omit(selectedCoordinatesById, parcel.id)
  }

  hasReachedLimit(selected) {
    const { allParcels, params } = this.props
    const { landsLimitPerBid } = params
    return (
      Object.keys(selected).filter(
        parcelId => allParcels[parcelId].owner == null
      ).length >= landsLimitPerBid
    )
  }

  getSelectedParcels() {
    const { allParcels, selectedCoordinatesById } = this.props

    if (!allParcels) return []

    const parcelIds = Object.keys(selectedCoordinatesById)
    const parcels = []

    for (const parcelId of parcelIds) {
      const parcel = allParcels[parcelId]
      if (parcel) {
        parcels.push(parcel)
      }
    }

    return parcels
  }

  roundPrice = price => {
    const { token } = this.props
    return (token === 'MANA'
      ? Math.round(price)
      : parseFloat(price.toFixed(2))
    ).toLocaleString()
  }

  handleToggle = () => {
    this.setState({ toggle: !this.state.toggle })
  }

  render() {
    const {
      authorization,
      params,
      center,
      allParcels,
      token,
      rate,
      selectedCoordinatesById,
      isConnecting,
      isConnected,
      isAvailableParcelLoading
    } = this.props

    const { showTokenTooltip } = this.state
    const {
      availableParcelCount,
      landsLimitPerBid,
      gasPriceLimit,
      currentPrice
    } = params
    const { x, y } = center

    if (!isConnecting && !isConnected) {
      return (
        <div>
          <SignInNotice />
        </div>
      )
    }

    if (!authorization || currentPrice == null || x == null) {
      return (
        <div>
          <Loader active size="massive" />
        </div>
      )
    }

    const selectedParcels = this.getSelectedParcels()
    const validSelectedParcels = selectedParcels.filter(
      parcel => parcel.owner == null
    )

    let auctionMenuClasses = 'auction-menu'
    if (this.state.toggle) {
      auctionMenuClasses += ' open'
    }

    return (
      <div className="AuctionPage">
        <div className="parcel-preview">
          <ParcelPreview
            x={x}
            y={y}
            parcels={allParcels}
            selected={validSelectedParcels}
            isDraggable
            showPopup
            showControls={true}
            showMinimap={true}
            onClick={this.handleSelectUnownedParcel}
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
                        &nbsp;({validSelectedParcels.length})
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
                          loading={rate == null}
                          symbol={token}
                          amount={this.roundPrice(currentPrice * rate)}
                        />
                      </div>
                    </div>
                    <div className="output-information">
                      <div className="information-block">
                        <p className="subtitle">
                          {t('auction_page.total_price')}
                        </p>
                        <Token
                          loading={rate == null}
                          symbol={token}
                          amount={this.roundPrice(
                            currentPrice * rate * validSelectedParcels.length
                          )}
                        />
                      </div>
                      <div className="information-block">
                        <Button
                          type="submit"
                          primary={true}
                          disabled={
                            validSelectedParcels.length === 0 || rate == null
                          }
                        >
                          {rate == null ? (
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
            </Grid.Row>

            {this.hasReachedLimit(selectedCoordinatesById) ? (
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
                              href={getVideoTutorialLink()}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {t('auction_page.video_tutorial')}
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
