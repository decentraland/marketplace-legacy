import React from 'react'
import PropTypes from 'prop-types'

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
    const { approveTransactions } = this.props.wallet
    return approveTransactions[approveTransactions.length - 1]
  }

  render() {
    const { isLoading, hasError, wallet } = this.props
    const { address, approvedBalance, landIsAuthorized } = wallet

    const email = ''

    return (
      <div className="SettingsPage">
        <Navbar />

        {isLoading || !address ? (
          <Loading />
        ) : hasError ? (
          <p>Whoops, error</p>
        ) : (
          <div className="container">
            <h2 className="title">Settings</h2>

            <div className="row">
              <div className="col-xs-12 col-sm-offset-3 col-sm-6">
                <SettingsForm
                  address={address}
                  email={email || ''}
                  manaApproved={approvedBalance}
                  approveTransaction={this.getApproveTransaction()}
                  onManaApprovedChange={this.handleManaApproval}
                  isLandAuthorized={landIsAuthorized}
                  onLandAuthorizedChange={this.handleLandAuthorization}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
