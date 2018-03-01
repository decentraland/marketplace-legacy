import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { Container, Loader } from 'semantic-ui-react'
import Navbar from 'components/Navbar'
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
    onConnect: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.onConnect()
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
          <div className="transaction-list">
            <div className="section-title">
              Pending <Badge size="tiny">{pendingTransactions.length}</Badge>
            </div>
            {pendingTransactions.map(tx => (
              <Transaction key={tx.hash} tx={tx} />
            ))}
          </div>
        ) : null}

        <br />

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

  render() {
    const { isEmpty, isLoading } = this.props

    return (
      <div className="ActivityPage">
        <Navbar />

        <Container text>
          {isLoading
            ? this.renderLoading()
            : isEmpty ? this.renderEmpty() : this.renderTransactionLists()}
        </Container>
      </div>
    )
  }
}
