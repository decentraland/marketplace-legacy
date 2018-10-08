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
import ParcelAttributes from 'components/ParcelAttributes'
import TxStatus from 'components/TxStatus'
import EstateName from 'components/EstateName'
import { parcelType, estateType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import { isOwner } from 'shared/asset'
import {
  getParcelMatcher,
  isEqualCoords,
  buildCoordinate,
  getParcelsNotIncluded
} from 'shared/parcel'
import {
  hasNeighbour,
  areConnected,
  isEstate,
  MAX_PARCELS_PER_TX
} from 'shared/estate'
import EstateSelectActions from './EstateSelectActions'
import './EstateSelect.css'

export default class EstateSelect extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    pristineEstate: estateType,
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
    if (!isOwner(wallet, buildCoordinate(x, y)) && !isOwner(wallet, asset.id)) {
      return
    }

    const { estate, onChange } = this.props
    const parcels = estate.data.parcels

    if (isEstate(asset) && asset.id !== estate.id) {
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
      return onChange(newParcels)
    }

    if (this.hasReachedAddLimit()) {
      return
    }

    onChange([...parcels, { x, y }])
  }

  hasParcelsChanged = parcels => {
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
    const { estate, pristineEstate } = this.props
    const newParcels = estate.data.parcels
    const pristineParcels = pristineEstate ? pristineEstate.data.parcels : []
    return getParcelsNotIncluded(newParcels, pristineParcels)
  }

  getParcelsToRemove() {
    const { estate, pristineEstate } = this.props
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
    const canEdit = isCreation || isOwner(wallet, estate.id)

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
                isOwner(wallet, estate.id) && (
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
                      <ParcelAttributes
                        key={parcel.id}
                        parcel={parcel}
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
                    canContinue={this.hasParcels(parcels)}
                    canSubmit={
                      this.hasParcels(parcels) &&
                      this.hasParcelsChanged(parcels)
                    }
                  />
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
