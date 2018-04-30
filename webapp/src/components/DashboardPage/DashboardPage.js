import React from 'react'
// import PropTypes from 'prop-types'

import { Container, Card, Loader } from 'semantic-ui-react'

import { dashboardType } from 'components/types'
import { t } from 'modules/translation/utils'

import './DashboardPage.css'

export default class DashboardPage extends React.PureComponent {
  static propTypes = {
    dashboard: dashboardType
  }

  componentWillMount() {
    const { onFetchDashboardStats } = this.props
    onFetchDashboardStats()
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
    const { dashboard } = this.props
    return (
      <Card.Group stackable={true}>
        <h1>{JSON.stringify(dashboard.stats)}</h1>
      </Card.Group>
    )
  }

  render() {
    const { isLoading } = this.props

    return (
      <div className="DashboardPage">
        <Container>
          {isLoading ? this.renderLoading() : this.renderStats()}
        </Container>
      </div>
    )
  }
}
