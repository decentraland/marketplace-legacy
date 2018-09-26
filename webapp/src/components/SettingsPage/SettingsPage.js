import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Loader } from 'semantic-ui-react'

import { locations } from 'locations'
import AddressBlock from 'components/AddressBlock'
import { walletType, authorizationType } from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import { isLedgerWallet, getTokenAmountToApprove } from 'modules/wallet/utils'
import SettingsForm from './SettingsForm'

import './SettingsPage.css'

export default class SettingsPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    authorizations: authorizationType,
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
    this.props.onAllowToken(checked, contractName, tokenContractName)
  }

  handleTokenApproval = (checked, contractName, tokenContractName) => {
    const amount = checked ? getTokenAmountToApprove() : 0
    this.props.onApproveToken(amount, contractName, tokenContractName)
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
    const { isLoading, isConnected, wallet, authorizations } = this.props

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
                  authorizations={authorizations}
                  isLedgerWallet={isLedgerWallet()}
                  onDerivationPathChange={this.handleDerivationPathChange}
                  onTokenAllowedChange={this.handleTokenAllowance}
                  onTokenApprovedChange={this.handleTokenApproval}
                />
              ) : (
                <p className="sign-in">
                  <T
                    id="global.sign_in_notice"
                    values={{
                      sign_in_link: (
                        <Link to={locations.signIn()}>
                          {t('global.sign_in')}
                        </Link>
                      )
                    }}
                  />
                </p>
              )}
            </div>
          </div>
        </Container>
      </div>
    )
  }
}
