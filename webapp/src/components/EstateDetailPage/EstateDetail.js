import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Header, Grid, Container, Button } from 'semantic-ui-react'

import AssetDetailPage from 'components/AssetDetailPage'
import ParcelCard from 'components/ParcelCard'
import AddressBlock from 'components/AddressBlock'
import { t } from 'modules/translation/utils'
import { estateType, parcelType } from 'components/types'
import { buildCoordinate } from 'shared/parcel'
import EstateActions from './EstateActions'
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

  renderEmptyEstate() {
    const { estate } = this.props
    return (
      <div className="EstateDetail empty">
        <span className="empty-estate-message">
          {t('estate_detail.empty_estate', {
            name: estate.data.name
          })}
        </span>
      </div>
    )
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

    if (estate.data.parcels.length === 0) {
      return this.renderEmptyEstate()
    }

    return (
      <div className="EstateDetail">
        <div className="parcel-preview" title={t('parcel_detail.view')}>
          <AssetDetailPage asset={estate} onAssetClick={onViewAssetClick} />
        </div>
        <Container>
          <Grid className="details">
            <Grid.Row>
              <Grid.Column
                width={WITH_ACTION_BUTTONS_WIDTH}
                className="parcels"
              >
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
              <Grid.Column className="parcel-actions-container" computer={8}>
                {isOwner ? (
                  <EstateActions
                    onEditMetadata={onEditMetadata}
                    assetId={estate.asset_id}
                  />
                ) : (
                  <span className="is-address">
                    <span>{t('global.owned_by')}</span>
                    <AddressBlock address={estate.owner} scale={4} />
                  </span>
                )}
              </Grid.Column>
              {allParcels && (
                <React.Fragment>
                  <Grid.Column
                    computer={
                      isOwner
                        ? WITH_ACTION_BUTTONS_WIDTH
                        : WITHOUT_ACTION_BUTTONS_WIDTH
                    }
                    mobile={WITHOUT_ACTION_BUTTONS_WIDTH}
                    className={'selected-parcels-headline'}
                  >
                    <h3 className="parcels-included">
                      {t('estate_detail.parcels')}
                      {isOwner && (
                        <Button
                          size="tiny"
                          className="link"
                          onClick={onEditParcels}
                        >
                          <Icon name="pencil" />
                          {t('estate_detail.edit_parcels')}{' '}
                        </Button>
                      )}
                    </h3>
                  </Grid.Column>
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
