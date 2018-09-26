import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Loader, Button } from 'semantic-ui-react'

import { locations } from 'locations'
import Prompt from 'components/Prompt'
import { transactionType, walletType } from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import Transaction from './Transaction'

import './ActivityPage.css'

export default class ActivityPage extends React.PureComponent {
  static propTypes = {
    pendingTransactions: PropTypes.arrayOf(transactionType),
    transactionHistory: PropTypes.arrayOf(transactionType),
    network: PropTypes.string,
    wallet: walletType,
    isEmpty: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { promptVisible: false }
  }

  handleClearClick = () => {
    this.setState({ promptVisible: true })
  }

  handlePromptConfirm = () => {
    const { onClear, address } = this.props
    onClear(address)
    this.handlePromptClose()
  }

  handlePromptClose = () => {
    this.setState({ promptVisible: false })
  }

  renderLoading() {
    return <Loader active size="huge" />
  }

  hasTradingPermissions() {
    const { allowances, authorizations } = this.props.wallet
    return (
      allowances.Marketplace.MANAToken > 0 &&
      authorizations.Marketplace.LANDRegistry
    )
  }

  renderEmpty() {
    return (
      <div className="empty">
        <p>
          {t('activity.no_activity')}
          <br />
          {this.hasTradingPermissions() ? (
            <T
              id="activity.start"
              values={{
                marketplace: (
                  <Link to={locations.marketplace()}>
                    {t('global.marketplace')}
                  </Link>
                )
              }}
            />
          ) : (
            <T
              id="activity.approve"
              values={{
                settings_link: (
                  <Link to={locations.settings()}>{t('global.settings')}</Link>
                )
              }}
            />
          )}
        </p>
      </div>
    )
  }

  renderModal() {
    return this.state.promptVisible ? (
      <Prompt
        title={t('activity.clear.title')}
        text={t('activity.clear.body')}
        onConfirm={this.handlePromptConfirm}
        onReject={this.handlePromptClose}
      />
    ) : null
  }

  renderTransactionLists() {
    const { pendingTransactions, transactionHistory, network } = this.props

    return (
      <React.Fragment>
        {this.renderModal()}

        <div className="section-title">
          {t('global.activity')}
          <div className="clear-button">
            <Button
              size="tiny"
              className="link"
              onClick={this.handleClearClick}
            >
              {t('global.clear')}
            </Button>
          </div>
        </div>

        {pendingTransactions.length > 0 ? (
          <div className="transaction-list pending-transaction-list">
            <div className="section-subtitle">
              {pendingTransactions.length}&nbsp;{t('activity.pending')}
            </div>
            {pendingTransactions.map(tx => (
              <Transaction key={tx.hash} tx={tx} network={network} />
            ))}
          </div>
        ) : null}

        {transactionHistory.length > 0 ? (
          <div className="transaction-list">
            <div className="section-subtitle">
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
    return (
      <T
        id="global.sign_in_notice"
        values={{
          sign_in_link: (
            <Link to={locations.signIn()}>{t('global.sign_in')}</Link>
          )
        }}
      />
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
      <div>
        <Container className="ActivityPage">{content}</Container>
      </div>
    )
  }
}
