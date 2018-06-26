import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Loader, Button } from 'semantic-ui-react'

import Transaction from './Transaction'
import { locations } from 'locations'
import { transactionType } from 'components/types'
import { t, t_html } from 'modules/translation/utils'
import Prompt from 'components/Prompt'

import './ActivityPage.css'

export default class ActivityPage extends React.PureComponent {
  static propTypes = {
    pendingTransactions: PropTypes.arrayOf(transactionType),
    transactionHistory: PropTypes.arrayOf(transactionType),
    network: PropTypes.string,
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
    const { onClear, address, transactionHistory } = this.props
    const transactions = transactionHistory.map(tx => tx.hash)
    onClear(address, transactions)
  }

  handlePromptClose = () => {
    this.setState({ promptVisible: false })
  }

  renderLoading() {
    return <Loader active size="huge" />
  }

  renderEmpty() {
    return (
      <div className="empty">
        <p>
          {t('activity.no_activity')}
          <br />
          {t_html('activity.start', {
            settings_link: (
              <Link to={locations.settings}>{t('global.settings')}</Link>
            )
          })}
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
            <div className="section-subsubtitle">
              {pendingTransactions.length}&nbsp;{t('activity.pending')}
            </div>
            {pendingTransactions.map(tx => (
              <Transaction key={tx.hash} tx={tx} network={network} />
            ))}
          </div>
        ) : null}

        {transactionHistory.length > 0 ? (
          <div className="transaction-list">
            <div className="section-subsubtitle">
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
