import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Loader, Container } from 'semantic-ui-react'
import ParcelModal from 'components/ParcelModal'
import Mana from 'components/Mana'
import { t, t_html } from 'modules/translation/utils'
import { walletType } from 'components/types'
import { locations } from 'locations'
import TransferManaForm from './TransferManaForm'
import './TransferManaPage.css'

const manaStyle = {
  display: 'inline-block',
  transform: 'translateY(3px)'
}

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
    return t_html('global.sign_in_notice', {
      sign_in_link: <Link to={locations.signIn}>{t('global.sign_in')}</Link>
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
        title={t('transfer_mana.title')}
        subtitle={
          <div>
            {t_html('transfer_mana.current_balance', {
              balance: (
                <span style={manaStyle}>
                  &nbsp;
                  <Mana amount={wallet.balance} />
                </span>
              )
            })}
          </div>
        }
        hasCustomFooter
      >
        <TransferManaForm
          address={wallet.address}
          balance={wallet.balance}
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
