import React from 'react'
import PropTypes from 'prop-types'

import { Container, Grid, Header, Loader } from 'semantic-ui-react'
import Navbar from 'components/Navbar'
import SettingsForm from './SettingsForm'

import { walletType } from 'components/types'
import { getManaToApprove } from 'modules/wallet/utils'

import './SettingsPage.css'

export default class SettingsPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    isLoading: PropTypes.bool,
    hasError: PropTypes.bool,
    onApproveMana: PropTypes.func,
    onAuthorizeLand: PropTypes.func,
    onUpdateDerivationPath: PropTypes.func
  }

  handleManaApproval = e => {
    // Support both a checkbox click and a element click
    const manaToApprove =
      e.currentTarget.type !== 'checkbox' || e.currentTarget.checked
        ? getManaToApprove()
        : 0

    this.props.onApproveMana(manaToApprove)
  }

  handleLandAuthorization = e => {
    this.props.onAuthorizeLand(e.currentTarget.checked)
  }

  handleDerivationPathChange = (e, data) => {
    const { derivationPath } = this.props.wallet

    if (derivationPath !== data.value) {
      this.props.onUpdateDerivationPath(data.value)
    }
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

  render() {
    const { isLoading, hasError, wallet } = this.props
    const {
      address,
      type,
      derivationPath,
      approvedBalance,
      isLandAuthorized
    } = wallet

    return (
      <div className="SettingsPage">
        <Navbar />

        {isLoading || !address ? (
          <Loader active size="massive" />
        ) : hasError ? (
          <p>Whoops, error</p>
        ) : (
          <Container text>
            <Header as="h1" size="huge" textAlign="center" className="title">
              Settings
            </Header>

            <Grid.Column>
              <SettingsForm
                address={address}
                walletType={type}
                walletDerivationPath={derivationPath}
                onDerivationPathChange={this.handleDerivationPathChange}
                manaApproved={approvedBalance}
                approveTransaction={this.getApproveTransaction()}
                onManaApprovedChange={this.handleManaApproval}
                isLandAuthorized={isLandAuthorized}
                authorizeTransaction={this.getAuthorizeTransaction()}
                onLandAuthorizedChange={this.handleLandAuthorization}
              />
            </Grid.Column>
          </Container>
        )}
      </div>
    )
  }
}
