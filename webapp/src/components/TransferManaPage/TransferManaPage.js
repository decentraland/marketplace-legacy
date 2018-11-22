import React from 'react'
import PropTypes from 'prop-types'
import { Loader, Container } from 'semantic-ui-react'

import ParcelModal from 'components/ParcelModal'
import Mana from 'components/Mana'
import SignInNotice from 'components/SignInNotice'
import { walletType } from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import TransferManaForm from './TransferManaForm'
import './TransferManaPage.css'

export default class TransferManaPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    isLoading: PropTypes.bool,
    isConnected: PropTypes.bool,
    isTxIdle: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
  }

  static defaultProps = {
    onCancel: () => {},
    onSubmit: () => {}
  }

  renderLoading() {
    return <Loader active size="huge" />
  }

  renderNotConnected() {
    return <SignInNotice />
  }

  renderContent() {
    const { wallet, isTxIdle, onSubmit, onCancel } = this.props
    return (
      <ParcelModal
        preview={
          <div className="big-mana-icon">
            <Mana />
          </div>
        }
        title={t('transfer_mana.title')}
        subtitle={
          <div>
            <T
              id="transfer_mana.current_balance"
              values={{
                balance: (
                  <span className="mana-icon-wrapper">
                    &nbsp;
                    <Mana amount={wallet.mana} />
                  </span>
                )
              }}
            />
          </div>
        }
        hasCustomFooter
      >
        <TransferManaForm
          address={wallet.address}
          mana={wallet.mana}
          isTxIdle={isTxIdle}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </ParcelModal>
    )
  }

  render() {
    const { isLoading, isConnected } = this.props

    let content
    if (isLoading) {
      content = this.renderLoading()
    } else if (!isConnected) {
      content = this.renderNotConnected()
    } else {
      content = this.renderContent()
    }

    return (
      <div>
        <Container className="TransferManaPage">{content}</Container>
      </div>
    )
  }
}
