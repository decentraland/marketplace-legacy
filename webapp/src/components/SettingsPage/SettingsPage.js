import React from 'react'
import PropTypes from 'prop-types'
import { Container, Loader } from 'semantic-ui-react'

import AddressBlock from 'components/AddressBlock'
import SignInNotice from 'components/SignInNotice'
import {
  walletType,
  authorizationType,
  transactionType
} from 'components/types'
import { isLedgerWallet } from '@dapps/modules/wallet/utils'
import { getTokenAmountToApprove } from 'modules/wallet/utils'
import SettingsForm from './SettingsForm'

import './SettingsPage.css'

export default class SettingsPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    authorization: authorizationType,
    pendingAllowTransactions: PropTypes.arrayOf(transactionType),
    pendingApproveTransactions: PropTypes.arrayOf(transactionType),
    isLoading: PropTypes.bool,
    isConnected: PropTypes.bool,
    onUpdateDerivationPath: PropTypes.func,
    onAllowToken: PropTypes.func,
    onApproveToken: PropTypes.func
  }

  handleDerivationPathChange = derivationPath => {
    const { wallet } = this.props

    if (wallet.derivationPath !== derivationPath) {
      this.props.onUpdateDerivationPath(derivationPath)
    }
  }

  handleTokenAllowance = (checked, contractName, tokenContractName) => {
    const amount = checked ? getTokenAmountToApprove() : 0
    this.props.onAllowToken(amount, contractName, tokenContractName)
  }

  handleTokenApproval = (checked, contractName, tokenContractName) => {
    this.props.onApproveToken(checked, contractName, tokenContractName)
  }

  renderLoading() {
    return (
      <div>
        <Loader active size="massive" />
      </div>
    )
  }

  render() {
    const {
      wallet,
      authorization,
      pendingAllowTransactions,
      pendingApproveTransactions,
      isLoading,
      isConnected
    } = this.props

    if (isLoading) {
      return this.renderLoading()
    }

    return (
      <div className="SettingsPage">
        <Container fluid>
          <div className="row">
            <div className="column blockie">
              {wallet.address ? (
                <AddressBlock
                  address={wallet.address}
                  hasTooltip={false}
                  hasLink={false}
                  scale={30}
                />
              ) : null}
            </div>
            <div className="column">
              {isConnected ? (
                <SettingsForm
                  wallet={wallet}
                  authorization={authorization}
                  isLedgerWallet={isLedgerWallet()}
                  pendingAllowTransactions={pendingAllowTransactions}
                  pendingApproveTransactions={pendingApproveTransactions}
                  onDerivationPathChange={this.handleDerivationPathChange}
                  onTokenAllowedChange={this.handleTokenAllowance}
                  onTokenApprovedChange={this.handleTokenApproval}
                />
              ) : (
                <SignInNotice />
              )}
            </div>
          </div>
        </Container>
      </div>
    )
  }
}
