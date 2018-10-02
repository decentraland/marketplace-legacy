import React from 'react'
import { txUtils, eth } from 'decentraland-eth'
import { Icon, Loader } from 'semantic-ui-react'
import CircularProgressbar from 'react-circular-progressbar'
import EtherscanLink from '@dapps/containers/EtherscanLink'
import { transactionType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import { getHash } from '../../utils'
import './Status.css'

const MINIMUM_CONFIRMATIONS = 20
const FETCH_CONFIRMATIONS_DELAY = 15 * 1000

export default class Status extends React.PureComponent {
  static propTypes = {
    tx: transactionType
  }

  constructor(props) {
    super(props)
    this.mounted = false
    this.state = {
      confirmations: null
    }
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  async getConfirmations(tx) {
    const hash = getHash(tx)
    const status = await txUtils.getTransaction(hash)
    if (status) {
      const txBlock = status.blockNumber
      if (txBlock) {
        const currentBlock = await eth.getBlockNumber()
        if (this.mounted) {
          const confirmations = currentBlock - txBlock + 1
          this.setState({ confirmations: Math.max(confirmations, 1) })
          if (confirmations < MINIMUM_CONFIRMATIONS) {
            setTimeout(() => {
              this.getConfirmations(tx)
            }, FETCH_CONFIRMATIONS_DELAY)
          }
        }
        return
      }
    }
    // this is just in case the network responds with a 'pending' status for a transaction
    // that we just changed from pending/dropped to confirmed/replaced, so we know it has at least 1 confirmation
    if (
      tx.status === txUtils.TRANSACTION_TYPES.confirmed ||
      (tx.status === txUtils.TRANSACTION_TYPES.replaced &&
        tx.replacedBy != null &&
        this.mounted)
    ) {
      this.setState({ confirmations: 1 })
      setTimeout(() => {
        this.getConfirmations(tx)
      }, FETCH_CONFIRMATIONS_DELAY)
    }
  }

  componentWillMount() {
    const { tx } = this.props
    this.getConfirmations(tx)
  }

  componentWillReceiveProps(nextProps) {
    const { tx } = this.props
    if (tx.status !== nextProps.tx.status) {
      this.getConfirmations(nextProps.tx)
    }
  }

  renderConfirmations(hash, status) {
    const { confirmations } = this.state
    if (confirmations == null) {
      return (
        <span className="no-link">
          {t('transaction_confirmations.waiting')}&nbsp;
        </span>
      )
    }
    if (confirmations < MINIMUM_CONFIRMATIONS) {
      return (
        <span className="no-link">
          {t('transaction_confirmations.count', {
            confirmations_count: confirmations
          })}
        </span>
      )
    }
    return (
      <EtherscanLink className="confirmed" txHash={hash}>
        {status}
      </EtherscanLink>
    )
  }

  renderText() {
    const { tx } = this.props
    switch (tx.status) {
      case null:
        return (
          <span className="no-link">
            {t('transaction_types.loading')}&hellip;
          </span>
        )
      case txUtils.TRANSACTION_TYPES.dropped:
        return <span className="no-link">{t('transaction_types.dropped')}</span>
      case txUtils.TRANSACTION_TYPES.replaced:
        return tx.replacedBy ? (
          this.renderConfirmations(
            tx.replacedBy,
            t('transaction_types.replaced')
          )
        ) : (
          <span className="no-link">{t('transaction_types.replaced')}</span>
        )
      case txUtils.TRANSACTION_TYPES.reverted:
        return (
          <EtherscanLink className="reverted" txHash={tx.hash}>
            {t('transaction_types.reverted')}
          </EtherscanLink>
        )
      case txUtils.TRANSACTION_TYPES.confirmed:
        return this.renderConfirmations(
          tx.hash,
          t('transaction_types.confirmed')
        )
      case txUtils.TRANSACTION_TYPES.pending:
        return (
          <EtherscanLink txHash={tx.hash}>
            {t('transaction_types.pending')}
          </EtherscanLink>
        )
      case txUtils.TRANSACTION_TYPES.queued:
        return (
          <EtherscanLink txHash={tx.hash}>
            {t('transaction_types.queued')}
          </EtherscanLink>
        )
    }
  }

  renderConfirmationIcon() {
    const { confirmations } = this.state
    if (confirmations == null) {
      return <Loader active size="mini" />
    }
    if (confirmations >= MINIMUM_CONFIRMATIONS) {
      return <Icon name="check" />
    }

    return (
      <CircularProgressbar
        percentage={confirmations / MINIMUM_CONFIRMATIONS * 100}
        strokeWidth={14}
        styles={{
          path: {
            stroke: '#ff4130'
          },
          trail: {
            stroke: '#2e3447'
          }
        }}
      />
    )
  }

  renderIcon() {
    const { tx } = this.props
    switch (tx.status) {
      case null:
        return <Icon name="question circle outline" />
      case txUtils.TRANSACTION_TYPES.dropped:
        return <Icon name="question circle outline" />
      case txUtils.TRANSACTION_TYPES.replaced:
        return tx.replacedBy ? (
          this.renderConfirmationIcon()
        ) : (
          <Icon name="question circle outline" />
        )
      case txUtils.TRANSACTION_TYPES.reverted:
        return <Icon name="warning sign" />
      case txUtils.TRANSACTION_TYPES.confirmed:
        return this.renderConfirmationIcon()
      case txUtils.TRANSACTION_TYPES.pending:
        return <Loader active size="mini" />
      case txUtils.TRANSACTION_TYPES.queued:
        return <Icon name="question circle outline" />
    }
  }

  getTooltip() {
    const { tx } = this.props
    switch (tx.status) {
      case null:
        return t('transaction_tooltips.loading')
      case txUtils.TRANSACTION_TYPES.dropped:
        return t('transaction_tooltips.dropped')
      case txUtils.TRANSACTION_TYPES.replaced:
        return tx.replacedBy ? null : t('transaction_tooltips.replaced')
      case txUtils.TRANSACTION_TYPES.reverted:
        return null
      case txUtils.TRANSACTION_TYPES.confirmed:
        return null
      case txUtils.TRANSACTION_TYPES.pending:
        return null
      case txUtils.TRANSACTION_TYPES.queued:
        return t('transaction_tooltips.queued')
    }
  }

  render() {
    const text = this.renderText()
    const icon = this.renderIcon()
    const tooltip = this.getTooltip()
    return (
      <div
        className="Status"
        data-balloon-pos="left"
        data-balloon-length="xlarge"
        data-balloon={tooltip}
      >
        <div className="status-text">{text}</div>
        <div className="status-icon">{icon}</div>
      </div>
    )
  }
}
