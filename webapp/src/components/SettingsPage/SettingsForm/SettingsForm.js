import React from 'react'
import PropTypes from 'prop-types'
import { txUtils } from 'decentraland-commons'

import Button from 'components/Button'
import EtherscanLink from 'components/EtherscanLink'

import { getManaToApprove } from 'modules/wallet/utils'

const MANA_TO_APPROVE = getManaToApprove()

export default class SettingsForm extends React.PureComponent {
  static propTypes = {
    address: PropTypes.string,
    email: PropTypes.string,
    manaApproved: PropTypes.number,
    approveTransaction: PropTypes.object,
    onManaApprovedChange: PropTypes.func,
    isLandAuthorized: PropTypes.bool,
    onLandAuthorizedChange: PropTypes.func
  }

  static defaultProps = {
    address: '',
    email: ''
  }

  render() {
    const {
      address,
      // email,
      manaApproved,
      approveTransaction,
      onManaApprovedChange,
      isLandAuthorized,
      onLandAuthorizedChange
    } = this.props

    const isApprovePending = txUtils.isPending(approveTransaction)
    const isApproveFailure = txUtils.isFailure(approveTransaction)

    return (
      <div className="SettingsForm">
        <form
          action=""
          method="POST"
          className={isApprovePending ? 'tx-pending' : ''}
        >
          <div className="InputGroup">
            <label htmlFor="address">Wallet address</label>
            <input
              id="address"
              className="input"
              disabled={true}
              type="text"
              value={address}
            />
          </div>

          {/*<div className="InputGroup">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            className="input"
            type="text"
            value={email}
            placeholder="Example: youremail@gmail.com"
          />
        </div>*/}

          <div className="InputGroup">
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
              data-balloon-pos="left"
              onChange={onManaApprovedChange}
            />

            {manaApproved > 0 ? (
              <p className="authorize-detail">
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
              </p>
            ) : (
              <p className="authorize-detail">
                Approve {MANA_TO_APPROVE.toLocaleString()} MANA usage for the
                contract
              </p>
            )}

            {isApprovePending || isApproveFailure ? (
              <small className="tx-pending-message">
                {isApprovePending
                  ? 'You have a pending transaction waiting to be confirmed.'
                  : 'Your transaction failed, you can try sending a new one.'}
                &nbsp;You can check Etherscan&nbsp;
                <EtherscanLink txHash={approveTransaction.hash}>
                  here
                </EtherscanLink>
              </small>
            ) : null}
          </div>

          <div className="InputGroup">
            <input
              type="checkbox"
              value={isLandAuthorized || false}
              onChange={onLandAuthorizedChange}
            />

            <p className="authorize-detail">
              {isLandAuthorized
                ? 'You have authorized the Marketplace contract to operate LAND on your behalf'
                : 'Authorize the Marketplace contract to operate LAND on your behalf'}
            </p>
          </div>

          <div className="text-center">
            <Button isSubmit={true}>SAVE</Button>
          </div>
        </form>
      </div>
    )
  }
}
