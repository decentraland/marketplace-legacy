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

import AssetDetailPage from 'components/AssetDetailPage'
import ParcelCard from 'components/ParcelCard'
import EstateSelectActions from './EstateSelectActions'
import { t } from 'modules/translation/utils'
import { parcelType, estateType } from 'components/types'
import { getCoordsMatcher, isEqualCoords, buildCoordinate } from 'shared/parcel'
import { isOwner } from 'shared/asset'
import { hasNeighbour, areConnected, isEstate } from 'shared/estate'
import { getParcelsNotIncluded } from 'shared/utils'
import './EstateSelect.css'

const MAX_PARCELS_PER_TX = 12

export default class EstateSelect extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    estatePristine: estateType,
    allParcels: PropTypes.objectOf(parcelType),
    wallet: PropTypes.object.isRequired,
    isCreation: PropTypes.bool.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCreateCancel: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onDeleteEstate: PropTypes.func.isRequired
  }

  getParcelClickHandler = wallet => (asset, { x, y }) => {
    if (
      !isOwner(wallet, buildCoordinate(x, y)) &&
      !isOwner(wallet, asset.asset_id)
    ) {
      return
    }

    const { estate, onChange } = this.props
    const parcels = estate.data.parcels

    if (isEstate(asset) && asset.asset_id !== estate.asset_id) {
      return
    }

    if (!hasNeighbour(x, y, parcels)) {
      return
    }

    if (this.hasReachedTransactionLimit()) {
      return
    }

    const isSelected = parcels.some(getCoordsMatcher({ x, y }))
    if (isSelected) {
      const newParcels = parcels.filter(
        coords => !isEqualCoords(coords, { x, y })
      )
      if (!areConnected(newParcels)) {
        return
      }
      return onChange(newParcels)
    }

    onChange([...parcels, { x, y }])
  }

  canContinue = parcels => {
    if (parcels.length > 1) {
      return true
    }

    if (this.props.estatePristine) {
      return !this.hasParcelsChanged(parcels)
    }

    return false
  }

  hasParcelsChanged = parcels => {
    const { estatePristine } = this.props
    if (!estatePristine) {
      return false
    }

    const pristineParcels = estatePristine.data.parcels

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

  getParcelsToAdd() {
    const { estate, estatePristine } = this.props
    const newParcels = estate.data.parcels
    const pristineParcels = estatePristine.data.parcels
    const parcelsToAdd = getParcelsNotIncluded(newParcels, pristineParcels)
    return parcelsToAdd
  }

  getParcelsToRemove() {
    const { estate, estatePristine } = this.props
    const newParcels = estate.data.parcels
    const pristineParcels = estatePristine.data.parcels
    const parcelsToRemove = getParcelsNotIncluded(pristineParcels, newParcels)
    return parcelsToRemove
  }

  hasReachedTransactionLimit() {
    const parcelsToAdd = this.getParcelsToAdd()
    const parcelsToRemove = this.getParcelsToRemove()
    return (
      parcelsToAdd.length >= MAX_PARCELS_PER_TX ||
      parcelsToRemove.length >= MAX_PARCELS_PER_TX
    )
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

  render() {
    const {
      estate,
      onCancel,
      onContinue,
      onSubmit,
      wallet,
      allParcels,
      isCreation,
      onCreateCancel,
      isTxIdle,
      onDeleteEstate
    } = this.props

    const parcels = estate.data.parcels
    const canEdit = isCreation || isOwner(wallet, estate.asset_id)

    return (
      <div className="EstateSelect">
        <div className="parcel-preview" title={t('parcel_detail.view')}>
          <AssetDetailPage
            asset={estate}
            showMiniMap={false}
            showControls={false}
            onAssetClick={this.getParcelClickHandler(wallet)}
          />
        </div>
        <Container>
          <Grid className="estate-selection">
            {this.hasReachedTransactionLimit() ? (
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
                  <p className="warning-parcels-limit" />
                </Grid.Column>
              </Grid.Row>
            ) : null}
            <Grid.Row>
              <Grid.Column width={isCreation ? 16 : 8}>
                <Header size="large">
                  <p>
                    {isCreation
                      ? t('estate_select.new_selection')
                      : t('estate_select.edit_selection')}
                  </p>
                </Header>
              </Grid.Column>
              {!isCreation &&
                isOwner(wallet, estate.asset_id) && (
                  <Grid.Column
                    width={8}
                    className={'selected-parcels-headline'}
                  >
                    <Button
                      size="tiny"
                      className="link"
                      onClick={onDeleteEstate}
                    >
                      <Icon name="trash" />
                      {t('estate_detail.dissolve')}{' '}
                    </Button>
                  </Grid.Column>
                )}
              <Grid.Column width={16} className={'selected-parcels'}>
                <p className="parcels-included">
                  {t('estate_select.description')}
                </p>
                {allParcels &&
                  parcels.map(({ x, y }) => {
                    const parcel = allParcels[buildCoordinate(x, y)]
                    return parcel ? (
                      <ParcelCard
                        key={parcel.id}
                        parcel={parcel}
                        withMap={false}
                        withLink={false}
                      />
                    ) : null
                  })}
              </Grid.Column>
              {canEdit && (
                <Grid.Column
                  className="parcel-actions-container"
                  computer={8}
                  tablet={16}
                >
                  <EstateSelectActions
                    isTxIdle={isTxIdle}
                    isCreation={isCreation}
                    onSubmit={onSubmit}
                    onCancel={isCreation ? onCreateCancel : onCancel}
                    onContinue={onContinue}
                    canContinue={this.canContinue(parcels)}
                    canSubmit={this.hasParcelsChanged(parcels)}
                  />
                  {!isCreation && this.renderTxLabel()}
                </Grid.Column>
              )}
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    )
  }
}
