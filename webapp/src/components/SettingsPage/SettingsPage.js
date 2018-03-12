import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Container, Grid, Header, Loader } from 'semantic-ui-react'
import SettingsForm from './SettingsForm'

import { walletType } from 'components/types'
import { getManaToApprove } from 'modules/wallet/utils'
import { locations } from 'locations'

import './SettingsPage.css'

export default class SettingsPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    isLoading: PropTypes.bool,
    isConnected: PropTypes.bool,
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
    const { isLoading, isConnected, wallet } = this.props
    const {
      address,
      type,
      derivationPath,
      approvedBalance,
      isLandAuthorized
    } = wallet

    if (isLoading) {
      return (
        <div>
          <Loader active size="massive" />
        </div>
      )
    }

    return (
      <Container text className="SettingsPage">
        <Header as="h1" size="huge" textAlign="center" className="title">
          Settings
        </Header>

        <Grid.Column>
          {isConnected ? (
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
          ) : (
            <p className="sign-in">
              You need to <Link to={locations.signIn}>Sign In</Link> to access
              this page
            </p>
          )}
        </Grid.Column>
      </Container>
    )
  }
}
