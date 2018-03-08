import React from 'react'
import PropTypes from 'prop-types'
import { WALLET_TYPES, txUtils } from 'decentraland-commons'

import { Form } from 'semantic-ui-react'
import EtherscanLink from 'components/EtherscanLink'
import TxStatus from 'components/TxStatus'
import DerivationPathDropdown from './DerivationPathDropdown'

import { getManaToApprove, getMarketplaceAddress } from 'modules/wallet/utils'

import './SettingsForm.css'

const MANA_TO_APPROVE = getManaToApprove()

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
          label="Wallet address"
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
                ? 'You have a pending transaction'
                : manaApproved > 0
                  ? 'Unchecking will approve 0 MANA'
                  : `Check to approve ${MANA_TO_APPROVE} MANA`
            }
            data-balloon-length="large"
            data-balloon-pos="left"
            onChange={onManaApprovedChange}
          />

          <div className="authorize-detail">
            {manaApproved > 0 ? (
              <React.Fragment>
                You have {manaApproved} MANA approved to be used by the
                contract.<br />
                {!isApprovePending &&
                  manaApproved < MANA_TO_APPROVE && (
                    <span
                      className="link"
                      data-balloon={`You will authorize ${MANA_TO_APPROVE.toLocaleString()} MANA`}
                      data-balloon-pos="up"
                      onClick={onManaApprovedChange}
                    >
                      Approve more
                    </span>
                  )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                Approve {MANA_TO_APPROVE.toLocaleString()} MANA usage for
                the&nbsp;
                <EtherscanLink address={getMarketplaceAddress()}>
                  Marketplace contract
                </EtherscanLink>
              </React.Fragment>
            )}

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
                ? 'You have a pending transaction'
                : manaApproved > 0
                  ? 'Unchecking unauthorizes LAND usage for the Marketplace contract'
                  : 'Checking authorizes LAND usage to the Marketplace contract'
            }
            data-balloon-length="large"
            data-balloon-pos="left"
            onChange={onLandAuthorizedChange}
          />

          <div className="authorize-detail">
            {isLandAuthorized ? (
              <React.Fragment>
                You have authorized the&nbsp;
                <EtherscanLink address={getMarketplaceAddress()}>
                  Marketplace contract
                </EtherscanLink>
                &nbsp;to operate LAND on your behalf
              </React.Fragment>
            ) : (
              <React.Fragment>
                Authorize the&nbsp;
                <EtherscanLink address={getMarketplaceAddress()}>
                  Marketplace contract
                </EtherscanLink>
                &nbsp;to operate LAND on your behalf
              </React.Fragment>
            )}

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
