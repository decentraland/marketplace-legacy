import React from 'react'
import PropTypes from 'prop-types'

import { Container, Grid, Card, Loader } from 'semantic-ui-react'

import { dashboardStatsType, publicationType } from 'components/types'
import { t } from 'modules/translation/utils'

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
        <Card meta="LAND owners" description={stats.landOwnersCount} />
        <Card meta="Active users" description={stats.activeUsersCount} />
        <Card meta="LAND traded" description={stats.totalLandTraded} />
        <Card meta="LAND on sale" description={stats.totalLandOnSale} />
      </Card.Group>
    )
  }

  renderPublications() {
    const { publications } = this.props
    return (
      <Card.Group stackable={true}>
        <div>
          <pre>{JSON.stringify(publications)}</pre>
        </div>
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
              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    <h3>Some numbers</h3>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column>
                    {isLoading ? this.renderLoading() : this.renderStats()}
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    <h3>Latest Transactions</h3>
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
