import React from 'react'
import PropTypes from 'prop-types'
import { Header, Grid, Container } from 'semantic-ui-react'

import TxStatus from 'components/TxStatus'
import AssetDetailPage from 'components/AssetDetailPage'
import ParcelCard from 'components/ParcelCard'
import EstateActions from './EstateActions'
import { t } from 'modules/translation/utils'
import { buildCoordinate } from 'shared/parcel'
import { estateType, parcelType } from 'components/types'
import './EstateDetail.css'

export default class EstateDetail extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onViewAssetClick: PropTypes.func.isRequired,
    allParcels: PropTypes.objectOf(parcelType),
    onEditParcels: PropTypes.func.isRequired,
    onEditMetadata: PropTypes.func.isRequired,
    onDeleteEstate: PropTypes.func.isRequired
  }

  render() {
    const {
      estate,
      isOwner,
      allParcels,
      onViewAssetClick,
      onEditParcels,
      onEditMetadata,
      onDeleteEstate,
      isTxIdle
    } = this.props
    const { parcels } = estate.data

    return (
      <div className="EstateDetail">
        <div className="parcel-preview" title={t('parcel_detail.view')}>
          <AssetDetailPage asset={estate} onAssetClick={onViewAssetClick} />
        </div>
        <Container>
          <Grid className="details">
            <Grid.Row>
              <Grid.Column computer={8} tablet={16} className={'parcels'}>
                <Header size="large">
                  <p className="estate-title">
                    {estate.data.name
                      ? estate.data.name
                      : t('estate_select.detail')}
                  </p>
                  {estate.data.description && (
                    <p className="estate-description">
                      {estate.data.description}
                    </p>
                  )}
                </Header>
              </Grid.Column>
              {isOwner && (
                <Grid.Column
                  className="parcel-actions-container"
                  tablet={16}
                  computer={8}
                >
                  <EstateActions
                    isTxIdle={isTxIdle}
                    onEditMetadata={onEditMetadata}
                    onEditParcels={onEditParcels}
                    onDeleteEstate={onDeleteEstate}
                  />
                  <TxStatus.Asset
                    asset={estate}
                    name={<span>{t('estate_detail.pending_tx')}</span>}
                  />
                </Grid.Column>
              )}
              <Grid.Column width={16} className={'selected-parcels'}>
                {allParcels && (
                  <React.Fragment>
                    <p className="parcels-included">
                      {t('estate_detail.parcels')}
                    </p>
                    {parcels.map(({ x, y }) => {
                      const parcel = allParcels[buildCoordinate(x, y)]
                      return parcel ? (
                        <ParcelCard
                          key={parcel.id}
                          parcel={parcel}
                          withMap={false}
                        />
                      ) : null
                    })}
                  </React.Fragment>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    )
  }
}
