import React from 'react'
import PropTypes from 'prop-types'
import { Loader, Container } from 'semantic-ui-react'

import ParcelModal from 'components/ParcelModal'
import Mana from 'components/Mana'
import SignInNotice from 'components/SignInNotice'
import { walletType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import BuyManaForm from './BuyManaForm'
import './BuyManaPage.css'

export default class BuyManaPage extends React.PureComponent {
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
            <Mana size={132} />
          </div>
        }
        title={t('buy_mana.title')}
        subtitle={t('buy_mana.available_eth', {
          eth: wallet.ethBalance ? wallet.ethBalance.toFixed(5) : 0
        })}
        isTxIdle={isTxIdle}
        hasCustomFooter
      >
        <BuyManaForm
          balance={wallet.ethBalance}
          address={wallet.address}
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
        <Container className="BuyManaPage">{content}</Container>
      </div>
    )
  }
}
