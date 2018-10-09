import React from 'react'
import PropTypes from 'prop-types'
import { utils } from 'decentraland-commons'
import { Link } from 'react-router-dom'
import { Loader, Form, Checkbox, Button } from 'semantic-ui-react'

import { locations } from 'locations'
import Mana from 'components/Mana'
import EtherscanLink from 'components/EtherscanLink'
import {
  walletType,
  authorizationType,
  transactionType
} from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import { getContractAddress } from 'modules/wallet/utils'
import { isFeatureEnabled } from 'lib/featureUtils'
import { token } from 'lib/token'
import DerivationPathDropdown from './DerivationPathDropdown'

import './SettingsForm.css'

export default class SettingsForm extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    authorization: authorizationType,
    isLedgerWallet: PropTypes.bool,
    pendingAllowTransactions: PropTypes.arrayOf(transactionType),
    pendingApproveTransactions: PropTypes.arrayOf(transactionType),
    onDerivationPathChange: PropTypes.func,
    onTokenAllowedChange: PropTypes.func,
    onTokenApprovedChange: PropTypes.func
  }

  static defaultProps = {
    wallet: {},
    authorization: {}
  }

  renderContractLink(contractName) {
    return (
      <EtherscanLink address={getContractAddress(contractName)}>
        {contractName}
      </EtherscanLink>
    )
  }

  renderLoading() {
    return (
      <Link
        to={locations.activity()}
        className="loader-tooltip"
        data-balloon={t('settings.pending_tx')}
        data-balloon-pos="up"
        data-balloon-length="large"
      >
        <Loader active size="mini" />
      </Link>
    )
  }

  renderAllowance(allowance, contractName) {
    const { pendingAllowTransactions } = this.props

    return Object.keys(allowance).map(tokenContractName => (
      <Form.Field key={tokenContractName}>
        {this.hasTransactionPending(
          pendingAllowTransactions,
          contractName,
          tokenContractName
        ) ? (
          this.renderLoading()
        ) : (
          <Checkbox
            checked={allowance[tokenContractName] > 0}
            onChange={this.getTokenAllowedChange(
              contractName,
              tokenContractName
            )}
          />
        )}
        <div className="title">{t(`settings.for_buying_${contractName}`)}</div>
        <div className="description">
          <T
            id="authorization.allow"
            values={{
              contract_link: this.renderContractLink(contractName),
              symbol: token.getSymbolByContractName(tokenContractName)
            }}
          />
        </div>
      </Form.Field>
    ))
  }

  renderApproval(approval, contractName) {
    const { pendingApproveTransactions } = this.props

    return Object.keys(approval).map(tokenContractName => (
      <Form.Field key={tokenContractName}>
        {this.hasTransactionPending(
          pendingApproveTransactions,
          contractName,
          tokenContractName
        ) ? (
          this.renderLoading()
        ) : (
          <Checkbox
            checked={approval[tokenContractName]}
            onChange={this.getTokenApprovedChange(
              contractName,
              tokenContractName
            )}
          />
        )}
        <div className="title">
          {token.getSymbolByContractName(tokenContractName)}
        </div>
        <div className="description">
          <T
            id="authorization.approve"
            values={{
              contract_link: this.renderContractLink(contractName),
              symbol: token.getSymbolByContractName(tokenContractName)
            }}
          />
        </div>
      </Form.Field>
    ))
  }

  getTokenAllowedChange(contractName, tokenContractName) {
    return (_, data) =>
      this.props.onTokenAllowedChange(
        data.checked,
        contractName,
        tokenContractName
      )
  }

  getTokenApprovedChange(contractName, tokenContractName) {
    return (_, data) =>
      this.props.onTokenApprovedChange(
        data.checked,
        contractName,
        tokenContractName
      )
  }

  filterWalletContracts(walletContracts) {
    const contracts = {}

    for (const contractName in walletContracts) {
      if (this.isDisabledContract(contractName)) {
        continue
      } else {
        contracts[contractName] = walletContracts[contractName]
      }
    }

    return contracts
  }

  hasTransactionPending(transactions, contractName, tokenContractName) {
    return transactions.some(
      transaction =>
        transaction.payload.contractName === contractName &&
        transaction.payload.tokenContractName === tokenContractName
    )
  }

  isDisabledContract(contractName) {
    return (
      !isFeatureEnabled('MORTGAGES') &&
      ['MortgageHelper', 'MortgageManager'].includes(contractName)
    )
  }

  render() {
    const {
      wallet,
      authorization,
      isLedgerWallet,
      onDerivationPathChange
    } = this.props

    const allowances = this.filterWalletContracts(authorization.allowances)
    const approvals = this.filterWalletContracts(authorization.approvals)

    return (
      <Form className="SettingsForm">
        <div className="form-group">
          <div className="subtitle">WALLET</div>

          {isLedgerWallet ? (
            <Form.Field>
              <DerivationPathDropdown
                value={wallet.derivationPath}
                onChange={onDerivationPathChange}
              />
            </Form.Field>
          ) : null}

          <Form.Field>
            <label htmlFor="wallet-address">{t('global.wallet_address')}</label>
            <label id="wallet-address">{wallet.address}</label>
          </Form.Field>

          <Form.Field>
            <label htmlFor="mana-balance">{t('global.balance')}</label>
            <div className="mana">
              <span id="mana-balance">
                <Mana amount={wallet.balance} unit="MANA" />
              </span>
              <span className="mana-actions">
                {isFeatureEnabled('BUY_MANA') ? (
                  <Link to={locations.buyMana()} replace>
                    <Button className="buy-more">{t('buy_mana.action')}</Button>
                  </Link>
                ) : (
                  <span
                    className="disabled-buy-more"
                    data-balloon={t('global.service_unavailable')}
                    data-balloon-pos="up"
                  >
                    <Button disabled className="buy-more">
                      {t('buy_mana.action')}
                    </Button>
                  </span>
                )}
                <Link to={locations.transferMana()} replace>
                  <Button>{t('transfer_mana.action')}</Button>
                </Link>
              </span>
            </div>
          </Form.Field>
        </div>

        <div className="form-group">
          <div className="subtitle">AUTHORIZATIONS</div>

          <div className="authorization-checks-container">
            {utils.isEmptyObject(authorization) ? (
              <div className="authorization-checks">
                <label>{t('settings.authorization')}</label>
                <p>
                  <T id="settings.authorization_error" />
                  <br />
                  <T id="settings.authorization_error_contact" />
                </p>
              </div>
            ) : (
              <div className="row">
                <div className="authorization-checks">
                  <label>{t('settings.for_buying')}</label>

                  {Object.keys(allowances).map(contractName =>
                    this.renderAllowance(allowances[contractName], contractName)
                  )}
                </div>
                <div className="authorization-checks">
                  <label>{t('settings.for_selling')}</label>

                  {Object.keys(approvals).map(contractName =>
                    this.renderApproval(approvals[contractName], contractName)
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Form>
    )
  }
}
