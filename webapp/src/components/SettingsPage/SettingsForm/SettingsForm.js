import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Form, Checkbox, Button } from 'semantic-ui-react'

import { locations } from 'locations'
import Mana from 'components/Mana'
import EtherscanLink from 'components/EtherscanLink'
import { walletType, authorizationType } from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import { getContractAddress } from 'modules/wallet/utils'
import { isFeatureEnabled } from 'lib/featureUtils'
import DerivationPathDropdown from './DerivationPathDropdown'
import { isPending } from '@dapps/modules/transaction/utils'

import './SettingsForm.css'

export default class SettingsForm extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    authorizations: authorizationType,
    isLedgerWallet: PropTypes.bool,
    onDerivationPathChange: PropTypes.func,
    onTokenAllowedChange: PropTypes.func,
    onTokenApprovedChange: PropTypes.func
  }

  static defaultProps = {
    wallet: {},
    authorizations: {}
  }

  renderContractLink(contractName) {
    return (
      <EtherscanLink address={getContractAddress(contractName)}>
        {contractName}
      </EtherscanLink>
    )
  }

  renderAllowance(allowance, contractName) {
    return Object.keys(allowance).map(tokenContractName => (
      <Form.Field key={tokenContractName}>
        <Checkbox
          checked={allowance[tokenContractName] > 0}
          onChange={this.getTokenAllowedChange(contractName, tokenContractName)}
        />
        <div className="authorize-detail">
          <div className="title">{contractName}</div>
          <div className="description">
            <T
              id={`authorization.allow.${tokenContractName}`}
              values={{ contract_link: this.renderContractLink(contractName) }}
            />
          </div>
        </div>
      </Form.Field>
    ))
  }

  renderApproval(approval, contractName) {
    return Object.keys(approval).map(tokenContractName => (
      <Form.Field key={tokenContractName}>
        <Checkbox
          checked={approval[tokenContractName]}
          onChange={this.getTokenApprovedChange(
            contractName,
            tokenContractName
          )}
        />
        <div className="authorize-detail">
          <div className="title">{contractName}</div>
          <div className="description">
            <T
              id={`authorization.approved.${tokenContractName}`}
              values={{ contract_link: this.renderContractLink(contractName) }}
            />
          </div>
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

  isDisabledContract(contractName) {
    return (
      !isFeatureEnabled('MORTGAGES') &&
      ['MortgageHelper', 'MortgageManager'].includes(contractName)
    )
  }

  render() {
    const {
      wallet,
      authorizations,
      isLedgerWallet,
      onDerivationPathChange
    } = this.props

    const allowances = this.filterWalletContracts(authorizations.allowances)
    const approvals = this.filterWalletContracts(authorizations.approvals)

    return (
      <Form className={`SettingsForm ${isTxPending ? 'tx-pending' : ''}`}>
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

        <div className="authorization-checks-container">
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
        </div>
      </Form>
    )
  }
}
