import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Form, Checkbox, Button } from 'semantic-ui-react'

import { locations } from 'locations'
import Mana from 'components/Mana'
import EtherscanLink from 'components/EtherscanLink'
import { walletType } from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import { getContractAddress } from 'modules/wallet/utils'
import { isFeatureEnabled } from 'lib/featureUtils'
import DerivationPathDropdown from './DerivationPathDropdown'
import { isPending } from '@dapps/modules/transaction/utils'

import './SettingsForm.css'

export default class SettingsForm extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    isLedgerWallet: PropTypes.bool,
    onDerivationPathChange: PropTypes.func,
    onTokenApprovedChange: PropTypes.func,
    onTokenAuthorizedChange: PropTypes.func
  }

  static defaultProps = {
    wallet: {}
  }

  renderContractLink(contractName) {
    return (
      <EtherscanLink address={getContractAddress(contractName)}>
        {contractName}
      </EtherscanLink>
    )
  }

  renderAllowance(allowance, tokenContractName) {
    return Object.keys(allowance).map(contractName => (
      <Form.Field key={contractName}>
        <Checkbox
          checked={allowance[contractName] > 0}
          onChange={this.getTokenApprovedChange(
            contractName,
            tokenContractName
          )}
        />
        <div className="authorize-detail">
          {allowance[contractName] > 0 ? (
            <T
              id={`token_allowance.approved.${tokenContractName}`}
              values={{
                contract_link: this.renderContractLink(contractName)
              }}
            />
          ) : (
            <T
              id={`token_allowance.approve.${tokenContractName}`}
              values={{
                contract_link: this.renderContractLink(contractName)
              }}
            />
          )}
        </div>
      </Form.Field>
    ))
  }

  renderAuthorization(authorization, tokenContractName) {
    return Object.keys(authorization).map(contractName => (
      <Form.Field key={contractName}>
        <Checkbox
          checked={authorization[contractName]}
          onChange={this.getTokenAuthorizedChange(
            contractName,
            tokenContractName
          )}
        />
        <div className="authorize-detail">
          {authorization[contractName] ? (
            <T
              id={`token_authorization.authorized.${tokenContractName}`}
              values={{
                contract_link: this.renderContractLink(contractName)
              }}
            />
          ) : (
            <T
              id={`token_authorization.authorize.${tokenContractName}`}
              values={{
                contract_link: this.renderContractLink(contractName)
              }}
            />
          )}
        </div>
      </Form.Field>
    ))
  }

  getTokenApprovedChange(contractName, tokenContractName) {
    return (_, data) =>
      this.props.onTokenApprovedChange(
        data.checked,
        contractName,
        tokenContractName
      )
  }

  getTokenAuthorizedChange(contractName, tokenContractName) {
    return (_, data) =>
      this.props.onTokenAuthorizedChange(
        data.checked,
        contractName,
        tokenContractName
      )
  }

  render() {
    const { wallet, isLedgerWallet, onDerivationPathChange } = this.props

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

          {Object.keys(wallet.allowances).map(tokenContractName =>
            this.renderAllowance(
              wallet.allowances[tokenContractName],
              tokenContractName
            )
          )}
          {Object.keys(wallet.authorizations).map(tokenContractName =>
            this.renderAuthorization(
              wallet.authorizations[tokenContractName],
              tokenContractName
            )
          )}
        </div>
      </Form>
    )
  }
}
