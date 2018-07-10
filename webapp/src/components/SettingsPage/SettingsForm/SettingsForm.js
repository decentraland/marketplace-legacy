import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { txUtils } from 'decentraland-eth'
import { isFeatureEnabled } from 'lib/featureUtils'
import Mana from 'components/Mana'
import { Form, Checkbox, Button } from 'semantic-ui-react'
import EtherscanLink from 'components/EtherscanLink'
import TxStatus from 'components/TxStatus'
import DerivationPathDropdown from './DerivationPathDropdown'

import {
  getMarketplaceAddress,
  getMortgageCreatorAddress,
  getMortgageManagerAddress
} from 'modules/wallet/utils'
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
    onLandAuthorizedChange: PropTypes.func,
    isMortgageApprovedForMana: PropTypes.bool,
    isMortgageApprovedForRCN: PropTypes.bool,
    onMortgageApprovedForManaChange: PropTypes.func,
    onMortgageApprovedForRCNChange: PropTypes.func,
    approveMortgageForManaTransaction: PropTypes.object,
    approveMortgageForRCNTransaction: PropTypes.object
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

  renderMortgageCreatorLink() {
    return (
      <EtherscanLink address={getMortgageCreatorAddress()}>
        {t('settings.mortgage_creator_contract')}
      </EtherscanLink>
    )
  }

  renderMortgageManagerLink() {
    return (
      <EtherscanLink address={getMortgageManagerAddress()}>
        {t('settings.mortgage_manager_contract')}
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
      onLandAuthorizedChange,
      isMortgageApprovedForMana,
      isMortgageApprovedForRCN,
      onMortgageApprovedForManaChange,
      onMortgageApprovedForRCNChange,
      approveMortgageForManaTransaction,
      approveMortgageForRCNTransaction
    } = this.props

    const isApprovePending = txUtils.isPending(approveTransaction)
    const isAuthorizePending = txUtils.isPending(authorizeTransaction)
    const isMortgageApprovedForManaPending = txUtils.isPending(
      approveMortgageForManaTransaction
    )
    const isMortgageApprovedForRCNPending = txUtils.isPending(
      approveMortgageForRCNTransaction
    )

    const isPending =
      isApprovePending ||
      isAuthorizePending ||
      isMortgageApprovedForManaPending ||
      isMortgageApprovedForRCNPending

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
              {isFeatureEnabled('BUY_MANA') ? (
                <Link to={locations.buyMana} replace>
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

          {isFeatureEnabled('MORTGAGES') && (
            <React.Fragment>
              <Form.Field>
                <Checkbox
                  checked={isMortgageApprovedForMana}
                  disabled={isMortgageApprovedForManaPending}
                  onChange={onMortgageApprovedForManaChange}
                />

                <div className="authorize-detail">
                  {isMortgageApprovedForMana
                    ? t_html('settings.you_approved_mortgage_mana', {
                        mortgage_contract_link: this.renderMortgageCreatorLink()
                      })
                    : t_html('settings.approve_mortgage_mana', {
                        mortgage_contract_link: this.renderMortgageCreatorLink()
                      })}

                  {isMortgageApprovedForManaPending && (
                    <TxStatus.Text
                      txHash={approveMortgageForManaTransaction.hash}
                      txStatus={approveMortgageForManaTransaction.status}
                    />
                  )}
                </div>
              </Form.Field>

              <Form.Field>
                <Checkbox
                  checked={isMortgageApprovedForRCN}
                  disabled={isMortgageApprovedForRCNPending}
                  onChange={onMortgageApprovedForRCNChange}
                />

                <div className="authorize-detail">
                  {isMortgageApprovedForRCN
                    ? t_html('settings.you_approved_mortgage_rcn', {
                        mortgage_contract_link: this.renderMortgageManagerLink()
                      })
                    : t_html('settings.approve_mortgage_rcn', {
                        mortgage_contract_link: this.renderMortgageManagerLink()
                      })}

                  {isMortgageApprovedForRCNPending && (
                    <TxStatus.Text
                      txHash={approveMortgageForRCNTransaction.hash}
                      txStatus={approveMortgageForRCNTransaction.status}
                    />
                  )}
                </div>
              </Form.Field>
            </React.Fragment>
          ) /* Mortgage Feature */}
        </div>
      </Form>
    )
  }
}
