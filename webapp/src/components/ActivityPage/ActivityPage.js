import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { Container, Loader } from 'semantic-ui-react'
import Badge from 'components/Badge'
import Transaction from './Transaction'

import { transactionType } from 'components/types'

import './ActivityPage.css'

export default class ActivityPage extends React.PureComponent {
  static propTypes = {
    pendingTransactions: PropTypes.arrayOf(transactionType),
    transactionHistory: PropTypes.arrayOf(transactionType),
    isEmpty: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired
  }

  renderLoading() {
    return <Loader active size="huge" />
  }

  renderEmpty() {
    return (
      <div className="empty">
        <p>
          You have no activity yet.<br />
          You can start by approving some MANA on your&nbsp;
          <Link to={locations.settings}>settings</Link>.
        </p>
      </div>
    )
  }

  renderTransactionLists() {
    const { pendingTransactions, transactionHistory } = this.props

    return (
      <React.Fragment>
        {pendingTransactions.length > 0 ? (
          <div className="transaction-list pending-transaction-list">
            <div className="section-title">
              Pending <Badge size="tiny">{pendingTransactions.length}</Badge>
            </div>
            {pendingTransactions.map(tx => (
              <Transaction key={tx.hash} tx={tx} />
            ))}
          </div>
        ) : null}

        {transactionHistory.length > 0 ? (
          <div className="transaction-list">
            <div className="section-title">
              History&nbsp;
              <Badge size="tiny" color="gray">
                {transactionHistory.length}
              </Badge>
            </div>
            {transactionHistory.map(tx => (
              <Transaction key={tx.hash} tx={tx} />
            ))}
          </div>
        ) : null}
      </React.Fragment>
    )
  }

  renderNotConnected() {
    return (
      <p className="sign-in">
        You need to <Link to={locations.signIn}>Sign In</Link> to access this
        page
      </p>
    )
  }

  render() {
    const { isEmpty, isLoading, isConnected } = this.props

    let content = null
    if (isLoading) {
      content = this.renderLoading()
    } else if (!isConnected) {
      content = this.renderNotConnected()
    } else if (isEmpty) {
      content = this.renderEmpty()
    } else {
      content = this.renderTransactionLists()
    }

    return (
      <Container text className="ActivityPage">
        {content}
      </Container>
    )
  }
}
