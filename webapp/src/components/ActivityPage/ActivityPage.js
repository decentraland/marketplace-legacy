import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { Container, Loader } from 'semantic-ui-react'
import Transaction from './Transaction'

import { transactionType, walletType } from 'components/types'
import { t, t_html } from 'modules/translation/utils'

import './ActivityPage.css'

export default class ActivityPage extends React.PureComponent {
  static propTypes = {
    hasAnyPermissionOn: PropTypes.bool.isRequired,
    pendingTransactions: PropTypes.arrayOf(transactionType),
    transactionHistory: PropTypes.arrayOf(transactionType),
    network: PropTypes.string,
    wallet: walletType,
    isEmpty: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired
  }

  renderLoading() {
    return <Loader active size="huge" />
  }

  hasAnyPermissionOn() {
    const {
      approvedBalance,
      isLandAuthorized,
      isMortgageApprovedForMana,
      isMortgageApprovedForRCN
    } = this.props.wallet

    return (
      approvedBalance ||
      isLandAuthorized ||
      isMortgageApprovedForMana ||
      isMortgageApprovedForRCN
    )
  }

  renderEmpty() {
    return (
      <div className="empty">
        <p>
          {t('activity.no_activity')}
          <br />
          {this.hasAnyPermissionOn()
            ? t_html('activity.start', {
                marketplace: (
                  <Link to={locations.marketplace}>
                    {t('global.marketplace')}
                  </Link>
                )
              })
            : t_html('activity.approve', {
                settings_link: (
                  <Link to={locations.settings}>{t('global.settings')}</Link>
                )
              })}
        </p>
      </div>
    )
  }

  renderTransactionLists() {
    const { pendingTransactions, transactionHistory, network } = this.props

    return (
      <React.Fragment>
        {pendingTransactions.length > 0 ? (
          <div className="transaction-list pending-transaction-list">
            <div className="section-title">
              {pendingTransactions.length}&nbsp;{t('activity.pending')}
            </div>
            {pendingTransactions.map(tx => (
              <Transaction key={tx.hash} tx={tx} network={network} />
            ))}
          </div>
        ) : null}

        {transactionHistory.length > 0 ? (
          <div className="transaction-list">
            <div className="section-title">
              {transactionHistory.length}&nbsp;{t('activity.completed')}
            </div>
            {transactionHistory.map(tx => (
              <Transaction key={tx.hash} tx={tx} network={network} />
            ))}
          </div>
        ) : null}
      </React.Fragment>
    )
  }

  renderNotConnected() {
    return t_html('global.sign_in_notice', {
      sign_in_link: <Link to={locations.signIn}>{t('global.sign_in')}</Link>
    })
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
      <div>
        <Container className="ActivityPage">{content}</Container>
      </div>
    )
  }
}
