import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Header, Grid, Container, Button } from 'semantic-ui-react'

import AssetDetailPage from 'components/AssetDetailPage'
import ParcelCard from 'components/ParcelCard'
import AddressBlock from 'components/AddressBlock'
import { estateType, parcelType, publicationType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import { buildCoordinate } from 'shared/parcel'
import EstateActions from './EstateActions'
import { getOpenPublication } from 'shared/asset'
import Mana from 'components/Mana'
import Expiration from 'components/Expiration'
import './EstateDetail.css'

const WITH_ACTION_BUTTONS_WIDTH = 8
const WITHOUT_ACTION_BUTTONS_WIDTH = 16

export default class EstateDetail extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    publications: PropTypes.objectOf(publicationType).isRequired,
    allParcels: PropTypes.objectOf(parcelType),
    isOwner: PropTypes.bool.isRequired,
    onViewAssetClick: PropTypes.func.isRequired,
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
      publications,
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

    const publication = getOpenPublication(estate, publications)

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
              <Grid.Column
                width={WITH_ACTION_BUTTONS_WIDTH}
                className="estate-owner-container"
              >
                {isOwner ? (
                  <div>
                    <Button
                      size="tiny"
                      className="link"
                      onClick={onEditMetadata}
                    >
                      <Icon name="pencil" />
                      {t('global.edit')}
                    </Button>
                  </div>
                ) : (
                  <span className="is-address">
                    <span>{t('global.owned_by')}</span>
                    <AddressBlock address={estate.owner} scale={4} />
                  </span>
                )}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              {publication && (
                <React.Fragment>
                  <Grid.Column width={4}>
                    <h3>{t('asset_detail.publication.price')}</h3>
                    <Mana
                      amount={parseFloat(publication.price)}
                      size={20}
                      className="mana-price-icon"
                    />
                  </Grid.Column>
                  <Grid.Column width={4} className="time-left">
                    <h3>{t('global.time_left')}</h3>
                    <Expiration
                      expiresAt={parseInt(publication.expires_at, 10)}
                      className={'PublicationExpiration'}
                    />
                  </Grid.Column>
                </React.Fragment>
              )}
              <Grid.Column className="parcel-actions-container" computer={8}>
                <EstateActions
                  isOwner={isOwner}
                  publications={publications}
                  estate={estate}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
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
