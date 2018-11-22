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
  Button
} from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import ParcelPreview from 'components/ParcelPreview'
import ParcelAttributes from 'components/ParcelAttributes'
import SignInNotice from 'components/SignInNotice'
import {
  authorizationType,
  auctionParamsType,
  walletType,
  parcelType
} from 'components/types'
import { hasSeenAuctionModal, TOKEN_SYMBOLS } from 'modules/auction/utils'
import { isParcel } from 'shared/parcel'
import { preventDefault } from 'lib/utils'
import TokenDropdown from './TokenDropdown'
import Token from './Token'

import './AuctionPage.css'

export default class AuctionPage extends React.PureComponent {
  static propTypes = {
    isConnected: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    isAvailableParcelLoading: PropTypes.bool.isRequired,
    authorization: authorizationType,
    auctionParams: auctionParamsType,
    auctionCenter: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }).isRequired,
    wallet: walletType,
    allParcels: PropTypes.objectOf(parcelType),
    onShowAuctionModal: PropTypes.func.isRequired,
    onFetchAuctionParams: PropTypes.func.isRequired,
    onSetParcelOnChainOwner: PropTypes.func.isRequired,
    onFetchAvailableParcel: PropTypes.func.isRequired,
    token: PropTypes.oneOf(TOKEN_SYMBOLS),
    rate: PropTypes.number
  }

  constructor(props) {
    super(props)

    this.hasFetchedParams = false

    this.state = {
      selectedCoordinatesById: {}
    }
  }

  componentWillMount() {
    const { onFetchAvailableParcel, isConnected } = this.props
    onFetchAvailableParcel()

    if (isConnected) {
      this.showAuctionModal(this.props)
      this.fetchAuctionParams()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isConnected && !nextProps.modal.open) {
      this.showAuctionModal(nextProps)
      this.fetchAuctionParams()
    }
  }

  showAuctionModal(props) {
    const { onShowAuctionModal } = props

    if (!hasSeenAuctionModal()) {
      onShowAuctionModal()
    }
  }

  fetchAuctionParams() {
    if (!this.hasFetchedParams) {
      this.props.onFetchAuctionParams()
      this.hasFetchedParams = true
    }
  }

  handleSelectUnownedParcel = async ({ asset }) => {
    if (!isParcel(asset) || asset.district_id != null) return

    const ownerOnChain = await this.getParcelOwnerOnChain(asset)
    if (!Contract.isEmptyAddress(ownerOnChain)) {
      this.props.onSetParcelOnChainOwner(asset.id, ownerOnChain)
      return
    }

    const wasOverLimit = this.hasReachedLimit(
      this.state.selectedCoordinatesById
    )

    const newSelectedCoordsById = this.getNewSelectedCoordsFor(asset)

    const isOverLimit = this.hasReachedLimit(newSelectedCoordsById)

    if (!wasOverLimit || (wasOverLimit && !isOverLimit)) {
      this.setState({ selectedCoordinatesById: newSelectedCoordsById })
    }
  }

  handleFindAvailableParcel = () => {
    this.props.onFetchAvailableParcel()
  }

  handleSubmit = () => {
    const { wallet, onSubmit } = this.props
    onSubmit(this.getSelectedParcels(), wallet.address)
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

  getNewSelectedCoordsFor(parcel) {
    const { selectedCoordinatesById } = this.state
    const { id, x, y } = parcel
    const isSelected = selectedCoordinatesById[id] !== undefined

    return isSelected
      ? utils.omit(selectedCoordinatesById, id)
      : { ...selectedCoordinatesById, [id]: { x, y } }
  }

  hasReachedLimit(selected) {
    const { landsLimitPerBid } = this.props.auctionParams
    return Object.keys(selected).length >= landsLimitPerBid
  }

  getSelectedParcels() {
    const { allParcels } = this.props
    const { selectedCoordinatesById } = this.state

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

  roundPrice(price) {
    return parseFloat(price)
      .toFixed(2)
      .toLocaleString()
  }

  render() {
    const {
      authorization,
      auctionParams,
      auctionCenter,
      allParcels,
      token,
      rate,
      onChangeToken
    } = this.props
    const { isConnecting, isConnected, isAvailableParcelLoading } = this.props
    const { selectedCoordinatesById } = this.state
    const {
      availableParcelCount,
      landsLimitPerBid,
      gasPriceLimit,
      currentPrice
    } = auctionParams
    const { x, y } = auctionCenter

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

    return (
      <div className="AuctionPage">
        <div className="parcel-preview">
          <ParcelPreview
            x={x}
            y={y}
            parcels={allParcels}
            selected={selectedParcels}
            isDraggable
            showPopup
            showControls={true}
            showMinimap={true}
            onClick={this.handleSelectUnownedParcel}
          />
        </div>

        <Container>
          <Grid className="auction-details">
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
                  <p className="warning-parcels-limit" />
                </Grid.Column>
              </Grid.Row>
            ) : null}

            <Grid.Row>
              <Grid.Column mobile={16} computer={6}>
                <Header size="large">{t('auction_page.title')}</Header>
                <p className="subtitle parcels-included-description">
                  {t('auction_page.description')}
                </p>
              </Grid.Column>

              <Grid.Column mobile={16} computer={10}>
                <Form onSubmit={preventDefault(this.handleSubmit)}>
                  <div className="information-blocks">
                    <div className="information-block">
                      <p className="subtitle">{t('auction_page.token')}</p>
                      <TokenDropdown token={token} onChange={onChangeToken} />
                    </div>
                    <div className="information-block">
                      <p className="subtitle">{t('auction_page.land_price')}</p>
                      <Token
                        loading={rate == null}
                        symbol={token}
                        amount={this.roundPrice(currentPrice * rate)}
                      />
                    </div>
                    <div className="information-block">
                      <p className="subtitle">{t('global.land')}</p>
                      <Header size="large">
                        {selectedParcels.length}/{landsLimitPerBid}
                      </Header>
                    </div>
                    <div className="bid-wrapper">
                      <div className="information-block">
                        <p className="subtitle">
                          {t('auction_page.total_price')}
                        </p>
                        <Token
                          loading={rate == null}
                          symbol={token}
                          amount={this.roundPrice(
                            currentPrice * rate * selectedParcels.length
                          )}
                        />
                      </div>
                      <div className="information-block">
                        <Button
                          type="submit"
                          primary={true}
                          disabled={
                            selectedParcels.length === 0 || rate == null
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

              {selectedParcels.length > 0 ? (
                <Grid.Column width={16} className="selected-parcels">
                  <div className="parcels-included">
                    {selectedParcels.map(parcel => (
                      <ParcelAttributes
                        key={parcel.id}
                        parcel={parcel}
                        withLink={false}
                        withTags={false}
                      />
                    ))}
                  </div>
                </Grid.Column>
              ) : null}

              {availableParcelCount > 0 ? (
                <Grid.Column width={16}>
                  <footer className="footer">
                    <span className="footer-left">
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
                    </span>
                    <span className="footer-right">
                      <span>
                        {t('auction_page.gas_price')}: {gasPriceLimit} Gwei
                      </span>
                    </span>
                  </footer>
                </Grid.Column>
              ) : null}
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    )
  }
}
