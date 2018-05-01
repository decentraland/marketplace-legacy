import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Container, Grid, Card, Loader } from 'semantic-ui-react'

import { locations } from 'locations'
import { dashboardStatsType, parcelType } from 'components/types'
import ParcelPreview from 'components/ParcelPreview'
import { t, t_html } from 'modules/translation/utils'
import { formatMana, distanceInWordsToNow } from 'lib/utils'

import './DashboardPage.css'

export default class DashboardPage extends React.PureComponent {
  static propTypes = {
    stats: dashboardStatsType,
    parcels: PropTypes.arrayOf(parcelType)
  }

  componentWillMount() {
    const { onFetchDashboardStats, onFetchDashboardPublications } = this.props
    onFetchDashboardStats()
    onFetchDashboardPublications()
  }

  handlePageChange = (event, data) => {
    this.navigateTo({
      page: data.activePage
    })
  }

  renderLoading() {
    return <Loader active size="huge" />
  }

  renderEmpty() {
    return (
      <div className="empty">
        <p>{t('marketplace.empty')}</p>
      </div>
    )
  }

  renderStats() {
    const { stats } = this.props

    if (!stats) return null

    return (
      <Card.Group className="DashboardStats" stackable={true} itemsPerRow={4}>
        <Card
          meta={t('dashboard.land_owners')}
          description={stats.landOwnersCount}
        />
        <Card
          meta={t('dashboard.active_users')}
          description={stats.activeUsersCount}
        />
        <Card
          meta={t('dashboard.land_traded')}
          description={stats.totalLandTraded}
        />
        <Card
          meta={t('dashboard.land_on_sale')}
          description={stats.totalLandOnSale}
        />
      </Card.Group>
    )
  }

  renderPublications() {
    const { parcels } = this.props
    return (
      <Card.Group
        className="DashboardPublications"
        stackable={true}
        itemsPerRow={2}
      >
        {parcels.map((parcel, index) => (
          <Card key={index}>
            <Card.Content>
              <ParcelPreview
                x={parcel.x}
                y={parcel.y}
                debounce={index * 100}
                width={144}
                height={144}
              />
              <Card.Description>
                {t_html('dashboard.transaction_description', {
                  parcel_link: (
                    <Link to={locations.parcelDetail(parcel.x, parcel.y)}>
                      {parcel.id}
                    </Link>
                  ),
                  seller_link: (
                    <Link to={locations.profilePage(parcel.publication.owner)}>
                      {parcel.publication.owner.slice(0, 6)}
                    </Link>
                  ),
                  buyer_link: (
                    <Link to={locations.profilePage(parcel.publication.buyer)}>
                      {parcel.publication.buyer.slice(0, 6)}
                    </Link>
                  ),
                  price: (
                    <span className="price">
                      {formatMana(parcel.publication.price)}
                    </span>
                  )
                })}
                <div className="date">
                  {distanceInWordsToNow(
                    parseInt(parcel.publication.block_time_updated_at)
                  )}
                </div>
              </Card.Description>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    )
  }

  render() {
    const { isLoading, isPublicationsLoading } = this.props

    return (
      <div className="DashboardPage">
        <Container>
          {isLoading && isPublicationsLoading ? (
            this.renderLoading()
          ) : (
            <React.Fragment>
              <Grid className="stats-grid">
                <Grid.Row>
                  <Grid.Column>
                    <h3>{t('dashboard.stats_title')}</h3>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column>
                    {isLoading ? this.renderLoading() : this.renderStats()}
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              <Grid className="latest-transactions-grid">
                <Grid.Row>
                  <Grid.Column>
                    <h3>{t('dashboard.transactions_title')}</h3>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column>
                    {isPublicationsLoading
                      ? this.renderLoading()
                      : this.renderPublications()}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </React.Fragment>
          )}
        </Container>
      </div>
    )
  }
}
