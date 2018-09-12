import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Loader, Container } from 'semantic-ui-react'
import ParcelModal from 'components/ParcelModal'
import Mana from 'components/Mana'
import { t, t_html } from 'modules/translation/utils'
import { walletType } from 'components/types'
import { locations } from 'locations'
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
    return t_html('global.sign_in_notice', {
      sign_in_link: <Link to={locations.signIn()}>{t('global.sign_in')}</Link>
    })
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
