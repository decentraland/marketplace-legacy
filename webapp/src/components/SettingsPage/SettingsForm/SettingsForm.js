import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Form, Checkbox, Button } from 'semantic-ui-react'

import { locations } from 'locations'
import Mana from 'components/Mana'
import EtherscanLink from 'components/EtherscanLink'
import TxStatus from 'components/TxStatus'
import { t, T } from '@dapps/modules/translation/utils'
import {
  getMarketplaceAddress,
  getMortgageHelperAddress,
  getMortgageManagerAddress
} from 'modules/wallet/utils'
import { isFeatureEnabled } from 'lib/featureUtils'
import DerivationPathDropdown from './DerivationPathDropdown'
import { isPending } from '@dapps/modules/transaction/utils'

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

  renderMortgageHelperLink() {
    return (
      <EtherscanLink address={getMortgageHelperAddress()}>
        {t('settings.mortgage_helper_contract')}
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

    const isApprovePending =
      approveTransaction && isPending(approveTransaction.status)
    const isAuthorizePending =
      authorizeTransaction && isPending(authorizeTransaction.status)
    const isMortgageApprovedForManaPending =
      approveMortgageForManaTransaction &&
      isPending(approveMortgageForManaTransaction.status)
    const isMortgageApprovedForRCNPending =
      approveMortgageForRCNTransaction &&
      isPending(approveMortgageForRCNTransaction.status)

    const isTxPending =
      isApprovePending ||
      isAuthorizePending ||
      isMortgageApprovedForManaPending ||
      isMortgageApprovedForRCNPending

    return (
      <Form className={`SettingsForm ${isTxPending ? 'tx-pending' : ''}`}>
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
          <Form.Field>
            <Checkbox
              checked={manaApproved > 0}
              disabled={isApprovePending}
              onChange={onManaApprovedChange}
            />
            <div className="authorize-detail">
              {manaApproved > 0 ? (
                <T
                  id="settings.mana_approved"
                  values={{
                    marketplace_contract_link: this.renderMarketplaceLink()
                  }}
                />
              ) : (
                <T
                  id="settings.approve_mana"
                  values={{
                    marketplace_contract_link: this.renderMarketplaceLink()
                  }}
                />
              )}

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
              {isLandAuthorized ? (
                <T
                  id="settings.you_authorized"
                  values={{
                    marketplace_contract_link: this.renderMarketplaceLink()
                  }}
                />
              ) : (
                <T
                  id="settings.authorize"
                  values={{
                    marketplace_contract_link: this.renderMarketplaceLink()
                  }}
                />
              )}

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
                  {isMortgageApprovedForMana ? (
                    <T
                      id="settings.you_approved_mortgage_mana"
                      values={{
                        mortgage_contract_link: this.renderMortgageHelperLink()
                      }}
                    />
                  ) : (
                    <T
                      id="settings.approve_mortgage_mana"
                      values={{
                        mortgage_contract_link: this.renderMortgageHelperLink()
                      }}
                    />
                  )}

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
                  {isMortgageApprovedForRCN ? (
                    <T
                      id="settings.you_approved_mortgage_rcn"
                      values={{
                        mortgage_contract_link: this.renderMortgageManagerLink()
                      }}
                    />
                  ) : (
                    <T
                      id="settings.approve_mortgage_rcn"
                      values={{
                        mortgage_contract_link: this.renderMortgageManagerLink()
                      }}
                    />
                  )}

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
