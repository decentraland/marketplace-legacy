import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { Container, Grid, Header, Loader } from 'semantic-ui-react'
import SettingsForm from './SettingsForm'

import { walletType } from 'components/types'
import { getManaToApprove } from 'modules/wallet/utils'
import { t, t_html } from 'modules/translation/utils'

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
      <div className="SettingsPage">
        <Container text>
          <Header as="h1" size="huge" textAlign="center" className="title">
            {t('global.settings')}
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
                {t_html('global.sign_in_notice', {
                  sign_in_link: (
                    <Link to={locations.signIn}>{t('global.sign_in')}</Link>
                  )
                })}
              </p>
            )}
          </Grid.Column>
        </Container>
      </div>
    )
  }
}
