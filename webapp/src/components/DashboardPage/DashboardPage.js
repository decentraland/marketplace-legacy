import React from 'react'
import PropTypes from 'prop-types'

import { Container, Card, Loader } from 'semantic-ui-react'

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
    return (
      <Card.Group stackable={true}>
        <div>
          <pre>{JSON.stringify(stats)}</pre>
        </div>
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
          {isLoading ? this.renderLoading() : this.renderStats()}
          {isPublicationsLoading
            ? this.renderLoading()
            : this.renderPublications()}
        </Container>
      </div>
    )
  }
}
