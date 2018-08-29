import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { Container, Loader } from 'semantic-ui-react'
import AddressBlock from 'components/AddressBlock'
import SettingsForm from './SettingsForm'

import { walletType } from 'components/types'
import {
  getManaToApprove,
  isLedgerWallet,
  getRCNToApprove
} from 'modules/wallet/utils'
import { t, t_html } from 'modules/translation/utils'

import './SettingsPage.css'

export default class SettingsPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    isLoading: PropTypes.bool,
    isConnected: PropTypes.bool,
    onApproveMana: PropTypes.func,
    onAuthorizeLand: PropTypes.func,
    onUpdateDerivationPath: PropTypes.func,
    onAuthorizeMortgageForMana: PropTypes.func,
    onAuthorizeMortgageForRCN: PropTypes.func
  }

  handleManaApproval = (event, data) => {
    const manaToApprove = data.checked ? getManaToApprove() : 0

    this.props.onApproveMana(manaToApprove)
  }

  handleLandAuthorization = (event, data) => {
    this.props.onAuthorizeLand(data.checked)
  }

  handleDerivationPathChange = derivationPath => {
    const { wallet } = this.props

    if (wallet.derivationPath !== derivationPath) {
      this.props.onUpdateDerivationPath(derivationPath)
    }
  }

  handleMortgageForManaApproval = (event, data) => {
    const manaToApprove = data.checked ? getManaToApprove() : 0
    this.props.onAuthorizeMortgageForMana(manaToApprove)
  }

  handleMortgageForRCNApproval = (event, data) => {
    const rcnToApprove = data.checked ? getRCNToApprove() : 0
    this.props.onAuthorizeMortgageForRCN(rcnToApprove)
  }

  getApproveTransaction() {
    // Transactions are ordered, the last one corresponds to the last sent
    const { approveManaTransactions } = this.props.wallet
    return approveManaTransactions[approveManaTransactions.length - 1]
  }

  getAuthorizeTransaction() {
    // Transactions are ordered, the last one corresponds to the last sent
    const { authorizeLandTransactions } = this.props.wallet
    return authorizeLandTransactions[authorizeLandTransactions.length - 1]
  }

  getApproveMortgageForManaTransaction() {
    // Transactions are ordered, the last one corresponds to the last sent
    const { approveMortgageForManaTransactions } = this.props.wallet
    return approveMortgageForManaTransactions[
      approveMortgageForManaTransactions.length - 1
    ]
  }

  getApproveMortgageForRCNTransaction() {
    // Transactions are ordered, the last one corresponds to the last sent
    const { approveMortgageForRCNTransactions } = this.props.wallet
    return approveMortgageForRCNTransactions[
      approveMortgageForRCNTransactions.length - 1
    ]
  }

  render() {
    const { isLoading, isConnected, wallet } = this.props
    const {
      address,
      balance,
      derivationPath,
      approvedBalance,
      isLandAuthorized,
      isMortgageApprovedForMana,
      isMortgageApprovedForRCN
    } = wallet

    if (isLoading) {
      return (
        <div>
          <Loader active size="massive" />
        </div>
      )
    }

    return (
      <div className="SettingsPage">
        <Container>
          <div className="row">
            <div className="column blockie">
              {address ? (
                <AddressBlock
                  address={address}
                  hasTooltip={false}
                  hasLink={false}
                  scale={30}
                />
              ) : null}
            </div>
            <div className="column">
              {isConnected ? (
                <SettingsForm
                  address={address}
                  balance={balance}
                  isLedgerWallet={isLedgerWallet()}
                  walletDerivationPath={derivationPath}
                  onDerivationPathChange={this.handleDerivationPathChange}
                  manaApproved={approvedBalance}
                  approveTransaction={this.getApproveTransaction()}
                  onManaApprovedChange={this.handleManaApproval}
                  isLandAuthorized={isLandAuthorized}
                  authorizeTransaction={this.getAuthorizeTransaction()}
                  onLandAuthorizedChange={this.handleLandAuthorization}
                  isMortgageApprovedForMana={isMortgageApprovedForMana}
                  isMortgageApprovedForRCN={isMortgageApprovedForRCN}
                  onMortgageApprovedForManaChange={
                    this.handleMortgageForManaApproval
                  }
                  onMortgageApprovedForRCNChange={
                    this.handleMortgageForRCNApproval
                  }
                  approveMortgageForManaTransaction={this.getApproveMortgageForManaTransaction()}
                  approveMortgageForRCNTransaction={this.getApproveMortgageForRCNTransaction()}
                />
              ) : (
                <p className="sign-in">
                  {t_html('global.sign_in_notice', {
                    sign_in_link: (
                      <Link to={locations.signIn}>{t('global.sign_in')}</Link>
                    )
                  })}
                </p>
              )}
            </div>
          </div>
        </Container>
      </div>
    )
  }
}
