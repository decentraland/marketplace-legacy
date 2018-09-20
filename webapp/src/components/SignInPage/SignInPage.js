import React from 'react'
import { PropTypes } from 'prop-types'
import { Button, Loader } from 'semantic-ui-react'

import { locations } from 'locations'
import StaticPage from 'components/StaticPage'
import { t, t_html } from '@dapps/modules/translation/utils'
import WalletIcon from './WalletIcon'
import { isMobile } from 'lib/utils'

import './SignInPage.css'

export default class SignInPage extends React.PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired,
    onConnect: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isConnected) {
      this.props.onNavigate(locations.settings())
    }
  }

  handleRetry = () => {
    this.props.onConnect()
  }

  render() {
    const { isLoading } = this.props

    return (
      <StaticPage className="SignInPage">
        {isLoading ? (
          <Loader active size="massive" />
        ) : (
          <div className="message">
            <WalletIcon />
            <h1>{t('sign_in.get_started')}</h1>
            <p className="sign-in-options">
              {t('sign_in.intro')}{' '}
              {isMobile()
                ? t_html('sign_in.options.mobile', {
                    coinbase_link: (
                      <a
                        href="https://wallet.coinbase.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Coinbase Wallet
                      </a>
                    ),
                    imtoken_link: (
                      <a
                        href="https://token.im"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        imToken
                      </a>
                    )
                  })
                : t_html('sign_in.options.desktop', {
                    metamask_link: (
                      <a
                        href="https://metamask.io"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        MetaMask
                      </a>
                    ),
                    mist_link: (
                      <a
                        href="https://github.com/ethereum/mist"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Mist
                      </a>
                    ),
                    ledger_nano_link: (
                      <a
                        href="https://www.ledgerwallet.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ledger Nano S
                      </a>
                    )
                  })}
            </p>
            <br />
            <Button type="button" primary onClick={this.handleRetry}>
              {t('global.connect')}
            </Button>
          </div>
        )}
      </StaticPage>
    )
  }
}
