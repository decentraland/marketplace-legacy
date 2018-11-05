import React from 'react'
import PropTypes from 'prop-types'
import { eth, Contract } from 'decentraland-eth'
import { utils } from 'decentraland-commons'
import {
  Message,
  Header,
  Grid,
  Container,
  Loader,
  Button
} from 'semantic-ui-react'

import ParcelPreview from 'components/ParcelPreview'
import ParcelAttributes from 'components/ParcelAttributes'
import {
  authorizationType,
  auctionParamsType,
  parcelType
} from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import { hasSeenAuctionModal, isAuthorized } from 'modules/auction/utils'
import { isParcel } from 'shared/parcel'
import { ASSET_TYPES, getAssetOnChainOwner } from 'shared/asset'

import './AuctionPage.css'

export default class AuctionPage extends React.PureComponent {
  static propTypes = {
    isConnected: PropTypes.bool.isRequired,
    authorization: authorizationType,
    auctionParams: auctionParamsType,
    allParcels: PropTypes.objectOf(parcelType),
    onShowAuctionModal: PropTypes.func.isRequired,
    onFetchAuctionParams: PropTypes.func.isRequired,
    onSetParcelOnChainOwner: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.areParamsFetched = false

    this.state = {
      selectedCoordsById: {}
    }
  }

  componentWillMount() {
    this.showAuctionModal(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.showAuctionModal(nextProps)

    if (nextProps.isConnected && this.areParamsFetched) {
      this.props.onFetchAuctionParams()
      this.areParamsFetched = true
    }
  }

  showAuctionModal(props) {
    const { authorization, onShowAuctionModal } = props

    if (
      !hasSeenAuctionModal() ||
      this.isAuctionContractAuthorized(authorization)
    ) {
      onShowAuctionModal()
    }
  }

  isAuctionContractAuthorized(authorization) {
    return authorization && !isAuthorized(authorization)
  }

  async handleSelectUnownedParcel(asset) {
    if (!isParcel(asset) || asset.district_id != null) return

    const onChainOwner = await this.getOnChainOwner(asset)
    if (!Contract.isEmptyAddress(onChainOwner)) return

    const newSelectedCoordsById = this.getNewSelectedCoordsFor(asset)
    if (this.hasReachedLimit(newSelectedCoordsById)) return

    this.setState({ selectedCoordsById: newSelectedCoordsById })
  }

  async getOnChainOwner(parcel) {
    const landRegistry = eth.getContract('LANDRegistry')
    const tokenId = await landRegistry.encodeTokenId(parcel.x, parcel.y)
    const onChainOwner = await getAssetOnChainOwner(ASSET_TYPES.parcel, tokenId)

    setTimeout(() =>
      this.props.onSetParcelOnChainOwner(parcel.id, onChainOwner)
    ) // Don't block the UI

    return onChainOwner
  }

  getNewSelectedCoordsFor(parcel) {
    const { selectedCoordsById } = this.state
    const { id, x, y } = parcel
    const isSelected = selectedCoordsById[id] !== undefined

    return isSelected
      ? utils.omit(selectedCoordsById, id)
      : { ...selectedCoordsById, [id]: { x, y } }
  }

  hasReachedLimit(selected) {
    const { landsLimitPerBid } = this.props.auctionParams
    return Object.keys(selected).length > landsLimitPerBid
  }

  getParcels() {
    const { allParcels } = this.props
    const { selectedCoordsById } = this.state

    if (!allParcels) return []

    const parcelIds = Object.keys(selectedCoordsById)
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
    const { authorization, auctionParams } = this.props
    const { landsLimitPerBid, gasPriceLimit, currentPrice } = auctionParams
    const { selectedCoordsById } = this.state

    const selected = Object.values(selectedCoordsById)

    if (!authorization) {
      return (
        <div>
          <Loader active size="massive" />
        </div>
      )
    }

    return (
      <div className="AuctionPage">
        <div className="parcel-preview">
          <ParcelPreview
            x={0}
            y={0}
            selected={selected}
            isDraggable
            showPopup
            showControls={true}
            showMinimap={true}
            onClick={this.handleSelectUnownedParcel.bind(this)}
          />
        </div>

        <Container>
          <Grid className="auction-details">
            {this.hasReachedLimit(selectedCoordsById) ? (
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
                <div className="information-blocks">
                  <div className="information-block">
                    <p className="subtitle">
                      {t('auction_page.gas_price').toUpperCase()}
                    </p>
                    <Header size="large">{gasPriceLimit} GWEI</Header>
                  </div>
                  <div className="information-block">
                    <p className="subtitle">
                      {t('auction_page.land_price').toUpperCase()}
                    </p>
                    <Header size="large">
                      {this.roundPrice(currentPrice)}
                    </Header>
                  </div>
                  <div className="information-block">
                    <p className="subtitle">{t('global.land')}</p>
                    <Header size="large">
                      {selected.length}/{landsLimitPerBid}
                    </Header>
                  </div>
                  <div className="information-block">
                    <p className="subtitle">
                      {t('auction_page.total_price').toUpperCase()}
                    </p>
                    <Header size="large">
                      {this.roundPrice(currentPrice * selected.length)}
                    </Header>
                  </div>
                  <div className="information-block">
                    <Button
                      type="submit"
                      primary={true}
                      disabled={selected.length === 0}
                    >
                      {t('auction_page.bid')}
                    </Button>
                  </div>
                </div>
              </Grid.Column>

              <Grid.Column width={16} className="selected-parcels">
                <div className="parcels-included">
                  {this.getParcels().map(parcel => (
                    <ParcelAttributes
                      key={parcel.id}
                      parcel={parcel}
                      withLink={false}
                      withTags={false}
                    />
                  ))}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    )
  }
}
