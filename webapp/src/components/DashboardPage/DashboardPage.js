import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Container, Grid, Card, Loader } from 'semantic-ui-react'

import { locations } from 'locations'
import { dashboardStatsType, publicationType } from 'components/types'
import ParcelPreview from 'components/ParcelPreview'
import { t, t_html } from 'modules/translation/utils'
import {
  formatMana,
  formatDate,
  distanceInWordsToNow,
  buildCoordinate
} from 'lib/utils'

import './DashboardPage.css'

export default class DashboardPage extends React.PureComponent {
  static propTypes = {
    stats: dashboardStatsType,
    publications: PropTypes.arrayOf(publicationType)
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
          header={stats.landOwnersCount.toLocaleString()}
          description={t('dashboard.land_owners')}
        />
        <Card
          header={stats.activeUsersCount.toLocaleString()}
          description={t('dashboard.active_users')}
        />
        <Card
          header={stats.totalLandTraded.toLocaleString()}
          description={t('dashboard.land_traded')}
        />
        <Card
          header={stats.totalLandOnSale.toLocaleString()}
          description={t('dashboard.land_on_sale')}
        />
      </Card.Group>
    )
  }

  renderPublications() {
    const { publications } = this.props
    return (
      <Card.Group
        className="DashboardPublications"
        stackable={true}
        itemsPerRow={2}
      >
        {publications.map((publication, index) => (
          <Card key={index}>
            <Card.Content>
              <span className="parcel-preview-container">
                <ParcelPreview
                  x={publication.x}
                  y={publication.y}
                  debounce={index * 100}
                  size={9}
                />
              </span>
              <Card.Description>
                {t_html('dashboard.transaction_description', {
                  parcel_link: (
                    <Link
                      to={locations.parcelDetail(publication.x, publication.y)}
                    >
                      {buildCoordinate(publication.x, publication.y)}
                    </Link>
                  ),
                  seller_link: (
                    <Link to={locations.profilePage(publication.owner)}>
                      {publication.owner.slice(0, 6)}
                    </Link>
                  ),
                  buyer_link: (
                    <Link to={locations.profilePage(publication.buyer)}>
                      {publication.buyer.slice(0, 6)}
                    </Link>
                  ),
                  price: (
                    <span className="price">
                      {formatMana(publication.price)}
                    </span>
                  )
                })}
                <div
                  className="date"
                  title={formatDate(+publication.block_time_updated_at)}
                >
                  {distanceInWordsToNow(+publication.block_time_updated_at)}
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
