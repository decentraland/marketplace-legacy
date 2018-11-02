import React from 'react'
import PropTypes from 'prop-types'
import {
  Message,
  Header,
  Grid,
  Container,
  Loader,
  Button
} from 'semantic-ui-react'
import { utils } from 'decentraland-commons'

import ParcelPreview from 'components/ParcelPreview'
import ParcelAttributes from 'components/ParcelAttributes'
import { authorizationType, parcelType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import { hasSeenAuctionModal, isAuthorized } from 'modules/auction/utils'

import './AuctionPage.css'

// TODO: Real number here
const MAX_PARCELS_PER_TX = 20

export default class AuctionPage extends React.PureComponent {
  static propTypes = {
    authorization: authorizationType,
    allParcels: PropTypes.objectOf(parcelType),
    onShowAuctionModal: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.parcelPrice = 3000 // TODO: use the contract to get this value
    this.state = {
      selectedCoordsById: {}
    }
  }

  componentWillMount() {
    this.showAuctionModal(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.showAuctionModal(nextProps)
  }

  showAuctionModal(props) {
    const { authorization, onShowAuctionModal } = props

    if (
      !hasSeenAuctionModal() ||
      (authorization && !isAuthorized(authorization))
    ) {
      onShowAuctionModal()
    }
  }

  selectUnownedParcel = (asset, { x, y }) => {
    const { selectedCoordsById } = this.state

    // TODO: Check ownership with contract
    if (asset.owner != null || asset.district_id != null) return

    let newSelectedCoordsById = {}

    const isSelected = selectedCoordsById[asset.id] !== undefined
    if (isSelected) {
      newSelectedCoordsById = utils.omit(selectedCoordsById, asset.id)
    } else {
      newSelectedCoordsById = {
        ...selectedCoordsById,
        [asset.id]: { x, y }
      }
    }

    if (this.hasReachedLimit(newSelectedCoordsById)) return

    this.setState({ selectedCoordsById: newSelectedCoordsById })
  }

  hasReachedLimit(selected) {
    return Object.keys(selected).length > MAX_PARCELS_PER_TX
  }

  handleSubmit = () => {}

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

  render() {
    const { authorization } = this.props
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
            onClick={this.selectUnownedParcel}
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
                      max: MAX_PARCELS_PER_TX
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
                    <Header size="large">300wei</Header>
                  </div>
                  <div className="information-block">
                    <p className="subtitle">
                      {t('auction_page.land_price').toUpperCase()}
                    </p>
                    <Header size="large">{this.parcelPrice}</Header>
                  </div>
                  <div className="information-block">
                    <p className="subtitle">{t('global.land')}</p>
                    <Header size="large">
                      {selected.length}/{MAX_PARCELS_PER_TX}
                    </Header>
                  </div>
                  <div className="information-block">
                    <p className="subtitle">
                      {t('auction_page.total_price').toUpperCase()}
                    </p>
                    <Header size="large">
                      {this.parcelPrice * selected.length}
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
