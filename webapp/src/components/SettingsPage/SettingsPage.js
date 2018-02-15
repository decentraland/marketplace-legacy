import React from 'react'
import PropTypes from 'prop-types'

import { Container, Grid, Header } from 'semantic-ui-react'
import Navbar from 'components/Navbar'
import Loading from 'components/Loading'
import SettingsForm from './SettingsForm'

import { walletType } from 'components/types'
import { getManaToApprove } from 'modules/wallet/utils'

import './SettingsPage.css'

export default class SettingsPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    isLoading: PropTypes.bool,
    hasError: PropTypes.bool,
    onConnect: PropTypes.func,
    onApproveMana: PropTypes.func,
    onAuthorizeLand: PropTypes.func
  }

  componentWillMount() {
    this.props.onConnect()
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
    const { address, approvedBalance, isLandAuthorized } = wallet

    const email = ''

    return (
      <div className="SettingsPage">
        <Navbar />

        {isLoading || !address ? (
          <Loading />
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
                email={email || ''}
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
