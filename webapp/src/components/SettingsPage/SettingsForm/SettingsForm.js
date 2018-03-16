import React from 'react'
import PropTypes from 'prop-types'
import { WALLET_TYPES, txUtils } from 'decentraland-commons'

import { Form } from 'semantic-ui-react'
import EtherscanLink from 'components/EtherscanLink'
import TxStatus from 'components/TxStatus'
import DerivationPathDropdown from './DerivationPathDropdown'

import { getMarketplaceAddress } from 'modules/wallet/utils'
import { t, t_html } from 'modules/translation/utils'

import './SettingsForm.css'

export default class SettingsForm extends React.PureComponent {
  static propTypes = {
    address: PropTypes.string,
    walletType: PropTypes.string,
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
      walletType,
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
        {walletType === WALLET_TYPES.ledger ? (
          <Form.Field>
            <DerivationPathDropdown
              defaultValue={walletDerivationPath}
              onChange={onDerivationPathChange}
            />
          </Form.Field>
        ) : null}

        <Form.Field
          id="wallet-address"
          control="input"
          type="text"
          label={t('global.wallet_address')}
          disabled={true}
          value={address}
        />

        <Form.Field>
          <input
            type="checkbox"
            checked={manaApproved > 0}
            disabled={isApprovePending}
            data-balloon={
              isApprovePending
                ? t('settings.pending_tx')
                : manaApproved > 0
                  ? t('settings.disapprove_mana_check')
                  : t('settings.approve_mana_check')
            }
            data-balloon-length="large"
            data-balloon-pos="right"
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

            {approveTransaction && (
              <TxStatus.Text
                txHash={approveTransaction.hash}
                txStatus={approveTransaction.status}
              />
            )}
          </div>
        </Form.Field>

        <Form.Field>
          <input
            type="checkbox"
            checked={isLandAuthorized || false}
            disabled={isAuthorizePending}
            data-balloon={
              isAuthorizePending
                ? t('settings.pending_tx')
                : isLandAuthorized
                  ? t('settings.unauthorize_land_check')
                  : t('settings.authorize_land_check')
            }
            data-balloon-length="large"
            data-balloon-pos="right"
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

            {authorizeTransaction && (
              <TxStatus.Text
                txHash={authorizeTransaction.hash}
                txStatus={authorizeTransaction.status}
              />
            )}
          </div>
        </Form.Field>
      </Form>
    )
  }
}
