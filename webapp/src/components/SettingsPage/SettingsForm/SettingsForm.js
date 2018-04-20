import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { txUtils } from 'decentraland-eth'
import Mana from 'components/Mana'
import { Form, Checkbox, Button } from 'semantic-ui-react'
import EtherscanLink from 'components/EtherscanLink'
import TxStatus from 'components/TxStatus'
import DerivationPathDropdown from './DerivationPathDropdown'

import { getMarketplaceAddress } from 'modules/wallet/utils'
import { t, t_html } from 'modules/translation/utils'
import { locations } from 'locations'

import './SettingsForm.css'

export default class SettingsForm extends React.PureComponent {
  static propTypes = {
    address: PropTypes.string,
    balance: PropTypes.number,
    isLedgerWallet: PropTypes.bool,
    walletDerivationPath: PropTypes.string,
    onDerivationPathChange: PropTypes.func,
    manaApproved: PropTypes.number,
    approveTransaction: PropTypes.object,
    onManaApprovedChange: PropTypes.func,
    isLandAuthorized: PropTypes.bool,
    authorizeTransaction: PropTypes.object,
    onLandAuthorizedChange: PropTypes.func
  }

  static defaultProps = {
    address: ''
  }

  renderMarketplaceLink() {
    return (
      <EtherscanLink address={getMarketplaceAddress()}>
        {t('settings.marketplace_contract')}
      </EtherscanLink>
    )
  }

  render() {
    const {
      address,
      balance,
      isLedgerWallet,
      walletDerivationPath,
      onDerivationPathChange,
      manaApproved,
      approveTransaction,
      onManaApprovedChange,
      isLandAuthorized,
      authorizeTransaction,
      onLandAuthorizedChange
    } = this.props

    const isApprovePending = txUtils.isPending(approveTransaction)
    const isAuthorizePending = txUtils.isPending(authorizeTransaction)

    const isPending = isApprovePending || isAuthorizePending

    return (
      <Form className={`SettingsForm ${isPending ? 'tx-pending' : ''}`}>
        {isLedgerWallet ? (
          <Form.Field>
            <DerivationPathDropdown
              value={walletDerivationPath}
              onChange={onDerivationPathChange}
            />
          </Form.Field>
        ) : null}

        <Form.Field>
          <label htmlFor="wallet-address">{t('global.wallet_address')}</label>
          <label id="wallet-address">{address}</label>
        </Form.Field>

        <Form.Field>
          <label htmlFor="mana-balance">{t('global.balance')}</label>
          <div className="mana">
            <span id="mana-balance">
              <Mana amount={balance} unit="MANA" />
            </span>
            <span className="mana-actions">
              <Link to={locations.buyMana} replace>
                <Button className="buy-more">{t('buy_mana.action')}</Button>
              </Link>
              <Link to={locations.transferMana} replace>
                <Button>{t('transfer_mana.action')}</Button>
              </Link>
            </span>
          </div>
        </Form.Field>
        <div className="authorization-checks">
          <label>{t('settings.authorization')}</label>
          <Form.Field>
            <Checkbox
              checked={manaApproved > 0}
              disabled={isApprovePending}
              onChange={onManaApprovedChange}
            />
            <div className="authorize-detail">
              {manaApproved > 0
                ? t_html('settings.mana_approved', {
                    marketplace_contract_link: this.renderMarketplaceLink()
                  })
                : t_html('settings.approve_mana', {
                    marketplace_contract_link: this.renderMarketplaceLink()
                  })}

              {isApprovePending && (
                <TxStatus.Text
                  txHash={approveTransaction.hash}
                  txStatus={approveTransaction.status}
                />
              )}
            </div>
          </Form.Field>

          <Form.Field>
            <Checkbox
              checked={isLandAuthorized}
              disabled={isAuthorizePending}
              onChange={onLandAuthorizedChange}
            />

            <div className="authorize-detail">
              {isLandAuthorized
                ? t_html('settings.you_authorized', {
                    marketplace_contract_link: this.renderMarketplaceLink()
                  })
                : t_html('settings.authorize', {
                    marketplace_contract_link: this.renderMarketplaceLink()
                  })}

              {isAuthorizePending && (
                <TxStatus.Text
                  txHash={authorizeTransaction.hash}
                  txStatus={authorizeTransaction.status}
                />
              )}
            </div>
          </Form.Field>
        </div>
      </Form>
    )
  }
}
