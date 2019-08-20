import React from 'react'
import PropTypes from 'prop-types'
import {
  Message,
  Header,
  Icon,
  Grid,
  Container,
  Button
} from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import AssetPreviewHeader from 'components/AssetPreviewHeader'
import ParcelCoords from 'components/ParcelCoords'
import TxStatus from 'components/TxStatus'
import EstateName from 'components/EstateName'
import { parcelType, estateType, bidType } from 'components/types'
import { ASSET_TYPES } from 'shared/asset'
import { ACTIONS, can, isOwner } from 'shared/roles'
import { TYPES } from 'shared/map'
import { isNewEstate } from 'shared/estate'
import {
  getParcelMatcher,
  isEqualCoords,
  getParcelsNotIncluded
} from 'shared/parcel'
import { hasNeighbour, areConnected, MAX_PARCELS_PER_TX } from 'shared/estate'
import { buildCoordinate } from 'shared/coordinates'
import './SelectEstateParcels.css'

export default class SelectEstateParcels extends React.PureComponent {
  static propTypes = {
    bids: PropTypes.arrayOf(bidType),
    pristineEstate: estateType,
    allParcels: PropTypes.objectOf(parcelType),
    wallet: PropTypes.object.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onDeleteEstate: PropTypes.func.isRequired,
    onCreateCancel: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      estate: props.pristineEstate
    }
  }

  handleChangeParcels = parcels => {
    const { estate } = this.state

    this.setState({
      estate: {
        ...estate,
        data: {
          ...estate.data,
          parcels
        }
      }
    })
  }

  handleParcelClick = tile => {
    const { id, x, y, assetType, type } = tile

    if (type > TYPES.withAccess) {
      return
    }

    const { estate } = this.state
    const parcels = estate.data.parcels

    if (assetType === ASSET_TYPES.estate && id !== estate.id) {
      return
    }

    if (!hasNeighbour(x, y, parcels)) {
      return
    }

    const parcel = { x, y }
    const isSelected = parcels.some(getParcelMatcher(parcel))
    if (isSelected) {
      if (this.hasReachedRemoveLimit()) {
        return
      }
      const newParcels = parcels.filter(
        coords => !isEqualCoords(coords, parcel)
      )
      if (!areConnected(newParcels)) {
        return
      }
      return this.handleChangeParcels(newParcels)
    }

    if (this.hasReachedAddLimit()) {
      return
    }

    this.handleChangeParcels([...parcels, { x, y }])
  }

  handleSubmit = () => {
    this.props.onSubmit(this.state.estate)
  }

  haveParcelsChanged = parcels => {
    const { pristineEstate } = this.props
    if (!pristineEstate) {
      return false
    }

    const pristineParcels = pristineEstate ? pristineEstate.data.parcels : []
    if (pristineParcels.length != parcels.length) {
      return true
    }

    if (
      getParcelsNotIncluded(parcels, pristineParcels).length ||
      getParcelsNotIncluded(pristineParcels, parcels).length
    ) {
      return true
    }

    return false
  }

  hasParcels(parcels) {
    return parcels.length > 1
  }

  getParcelsToAdd() {
    const { estate } = this.state
    const { pristineEstate } = this.props
    const newParcels = estate.data.parcels
    const pristineParcels = pristineEstate ? pristineEstate.data.parcels : []
    return getParcelsNotIncluded(newParcels, pristineParcels)
  }

  getParcelsToRemove() {
    const { estate } = this.state
    const { pristineEstate } = this.props
    const newParcels = estate.data.parcels
    const pristineParcels = pristineEstate ? pristineEstate.data.parcels : []
    return getParcelsNotIncluded(pristineParcels, newParcels)
  }

  hasReachedAddLimit() {
    const parcelsToAdd = this.getParcelsToAdd()
    return parcelsToAdd.length >= MAX_PARCELS_PER_TX
  }

  hasReachedRemoveLimit() {
    const parcelsToRemove = this.getParcelsToRemove()
    return parcelsToRemove.length >= MAX_PARCELS_PER_TX
  }

  getEstateParcels() {
    const { estate } = this.state
    const { allParcels } = this.props
    const parcels = []

    for (const { x, y } of estate.data.parcels) {
      const parcel = allParcels[buildCoordinate(x, y)]
      if (parcel) parcels.push(parcel)
    }
    return parcels
  }

  renderTxLabel = () => {
    const parcelsToAdd = this.getParcelsToAdd()
    const parcelsToRemove = this.getParcelsToRemove()

    return (
      <React.Fragment>
        {!!parcelsToAdd.length && (
          <p className="tx-label">
            {t('estate_select.tx_to_be_send', {
              action: t('global.add'),
              parcels: parcelsToAdd.map(({ x, y }) => `(${x},${y})`).join(', ')
            })}
          </p>
        )}
        {!!parcelsToRemove.length && (
          <p className="tx-label">
            {t('estate_select.tx_to_be_send', {
              action: t('global.remove'),
              parcels: parcelsToRemove
                .map(({ x, y }) => `(${x},${y})`)
                .join(', ')
            })}
          </p>
        )}
      </React.Fragment>
    )
  }

  canTransfer() {
    const { wallet, estate } = this.props
    return isNewEstate(estate) || can(ACTIONS.transfer, wallet.address, estate)
  }

  render() {
    const { estate } = this.state
    const {
      pristineEstate,
      bids,
      wallet,
      allParcels,
      isTxIdle,
      onDeleteEstate,
      onCreateCancel,
      onCancel
    } = this.props

    const parcels = estate.data.parcels
    const isCreation = isNewEstate(pristineEstate)

    const canTransfer = this.canTransfer()
    const canContinue = this.hasParcels(parcels)
    const canSubmit = canContinue && this.haveParcelsChanged(parcels)

    return (
      <div className="SelectEstateParcels">
        <AssetPreviewHeader
          asset={estate}
          showMiniMap={false}
          showControls={false}
          onAssetClick={this.handleParcelClick}
        />
        <Container>
          {bids.length > 0 && (
            <Container text className="bids-warning">
              <Message
                warning
                icon="warning sign"
                header={t('global.warning')}
                content={t('estate_select.bids_warning')}
              />
            </Container>
          )}
          <Grid className="estate-selection" stackable>
            {this.hasReachedAddLimit() || this.hasReachedRemoveLimit() ? (
              <Grid.Row>
                <Grid.Column width={16}>
                  <Message
                    warning
                    icon="warning sign"
                    header={t('estate_detail.maximum_parcels_title')}
                    content={t('estate_detail.maximum_parcels_message', {
                      max: MAX_PARCELS_PER_TX
                    })}
                  />
                </Grid.Column>
              </Grid.Row>
            ) : null}

            <Grid.Row>
              <Grid.Column width={16}>
                <Header size="large">
                  {isCreation
                    ? t('estate_select.new_selection')
                    : t('estate_select.edit_selection')}
                </Header>
                {/*We only allow owners to dissolve their own states to avoid confusing transfers with operators*/
                !isCreation &&
                  isOwner(wallet.address, estate) && (
                    <Button
                      size="tiny"
                      className="link dissolve-button"
                      onClick={onDeleteEstate}
                    >
                      <Icon name="trash" />
                      {t('estate_detail.dissolve').toUpperCase()}
                    </Button>
                  )}
                <p className="parcels-included-description">
                  {t('estate_select.description')}
                </p>
              </Grid.Column>
              {allParcels && (
                <Grid.Column width={16}>
                  <ParcelCoords
                    parcels={this.getEstateParcels()}
                    isCollapsable={false}
                  />
                </Grid.Column>
              )}
              {canTransfer && (
                <Grid.Column width={16}>
                  <div className="actions">
                    {isTxIdle && <TxStatus.Idle isIdle={isTxIdle} />}
                    <Button
                      size="tiny"
                      onClick={isCreation ? onCreateCancel : onCancel}
                    >
                      {t('global.cancel')}
                    </Button>
                    <Button
                      size="tiny"
                      disabled={isCreation ? !canContinue : !canSubmit}
                      onClick={this.handleSubmit}
                      primary
                    >
                      {isCreation ? t('global.continue') : t('global.submit')}
                    </Button>
                  </div>

                  {!isCreation && this.renderTxLabel()}
                  <TxStatus.Asset
                    asset={estate}
                    name={<EstateName estate={estate} />}
                  />
                </Grid.Column>
              )}
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    )
  }
}
