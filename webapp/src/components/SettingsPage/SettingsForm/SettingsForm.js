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

  constructor(props) {
    super(props)

    this.state = {
      legacyAuthorizationsVisible: false
    }
  }

  toggleLegacyAuhorizations = () => {
    const { legacyAuthorizationsVisible } = this.state
    this.setState({ legacyAuthorizationsVisible: !legacyAuthorizationsVisible })
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
          {allowance[tokenContractName] > 0 ? (
            <T
              id={`authorization.allowed.${tokenContractName}`}
              values={{ contract_link: this.renderContractLink(contractName) }}
            />
          ) : (
            <T
              id={`authorization.allow.${tokenContractName}`}
              values={{ contract_link: this.renderContractLink(contractName) }}
            />
          )}
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
          {approval[tokenContractName] ? (
            <T
              id={`authorization.approved.${tokenContractName}`}
              values={{ contract_link: this.renderContractLink(contractName) }}
            />
          ) : (
            <T
              id={`authorization.approve.${tokenContractName}`}
              values={{ contract_link: this.renderContractLink(contractName) }}
            />
          )}
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
    const legacyContracts = {}

    for (const contractName in walletContracts) {
      if (this.isLegacyContract(contractName)) {
        legacyContracts[contractName] = walletContracts[contractName]
      } else if (this.isDisabledContract(contractName)) {
        continue
      } else {
        contracts[contractName] = walletContracts[contractName]
      }
    }

    return { contracts, legacyContracts }
  }

  isLegacyContract(contractName) {
    return contractName === 'LegacyMarketplace'
  }

  isDisabledContract(contractName) {
    return (
      (!isFeatureEnabled('MORTGAGES') &&
        ['MortgageHelper', 'MortgageManager'].includes(contractName)) ||
      (!isFeatureEnabled('MARKETPLACEV2') && contractName === 'Marketplace')
    )
  }

  render() {
    const {
      wallet,
      authorizations,
      isLedgerWallet,
      onDerivationPathChange
    } = this.props
    const { legacyAuthorizationsVisible } = this.state

    const {
      contracts: allowances,
      legacyContracts: legacyAllowances
    } = this.filterWalletContracts(authorizations.allowances)
    const {
      contracts: approvals,
      legacyContracts: legacyApprovals
    } = this.filterWalletContracts(authorizations.approvals)

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
        <div className="authorization-checks">
          <label>{t('settings.authorization')}</label>

          {Object.keys(allowances).map(contractName =>
            this.renderAllowance(allowances[contractName], contractName)
          )}
          {Object.keys(approvals).map(contractName =>
            this.renderApproval(approvals[contractName], contractName)
          )}

          <small className="link" onClick={this.toggleLegacyAuhorizations}>
            {t('settings.view_more')}
          </small>
        </div>

        {legacyAuthorizationsVisible ? (
          <div className="authorization-checks legacy-authorizations">
            <label>{t('settings.legacy_authorization')} </label>

            <React.Fragment>
              {Object.keys(legacyAllowances).map(tokenContractName =>
                this.renderAllowance(
                  legacyAllowances[tokenContractName],
                  tokenContractName
                )
              )}
              {Object.keys(legacyApprovals).map(tokenContractName =>
                this.renderApproval(
                  legacyApprovals[tokenContractName],
                  tokenContractName
                )
              )}
            </React.Fragment>
          </div>
        ) : null}
      </Form>
    )
  }
}
