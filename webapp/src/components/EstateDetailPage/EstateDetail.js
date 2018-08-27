import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Header, Grid, Container, Button } from 'semantic-ui-react'

import AssetDetailPage from 'components/AssetDetailPage'
import ParcelCard from 'components/ParcelCard'
import EstateActions from './EstateActions'
import { t } from 'modules/translation/utils'
import { buildCoordinate } from 'shared/parcel'
import { estateType, parcelType } from 'components/types'
import './EstateDetail.css'

const WITH_ACTION_BUTTONS_WIDTH = 8
const WITHOUT_ACTION_BUTTONS_WIDTH = 16

export default class EstateDetail extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    onViewAssetClick: PropTypes.func.isRequired,
    allParcels: PropTypes.objectOf(parcelType),
    onEditParcels: PropTypes.func.isRequired,
    onEditMetadata: PropTypes.func.isRequired
  }

  render() {
    const {
      estate,
      isOwner,
      allParcels,
      onViewAssetClick,
      onEditParcels,
      onEditMetadata
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
              <Grid.Column width={8} className={'parcels'}>
                <Header size="large">
                  <p className="estate-title">
                    {estate.data.name || t('estate_select.detail')}
                  </p>
                  {estate.data.description && (
                    <p className="estate-description">
                      {estate.data.description}
                    </p>
                  )}
                </Header>
              </Grid.Column>
              {isOwner && (
                <Grid.Column className="parcel-actions-container" computer={8}>
                  <EstateActions
                    onEditMetadata={onEditMetadata}
                    assetId={estate.asset_id}
                  />
                </Grid.Column>
              )}
              {allParcels && (
                <React.Fragment>
                  <Grid.Column
                    width={
                      isOwner
                        ? WITH_ACTION_BUTTONS_WIDTH
                        : WITHOUT_ACTION_BUTTONS_WIDTH
                    }
                    className={'selected-parcels-headline'}
                  >
                    <h3 className="parcels-included">
                      {t('estate_detail.parcels')}
                      <Button
                        size="tiny"
                        className="link"
                        onClick={onEditParcels}
                      >
                        <Icon name="pencil" />
                        {t('estate_detail.edit_parcels')}{' '}
                      </Button>
                    </h3>
                  </Grid.Column>
                  {isOwner && (
                    <Grid.Column
                      width={8}
                      className={'selected-parcels-headline'}
                    />
                  )}
                  <Grid.Column width={16} className={'selected-parcels'}>
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
                  </Grid.Column>
                </React.Fragment>
              )}
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    )
  }
}
