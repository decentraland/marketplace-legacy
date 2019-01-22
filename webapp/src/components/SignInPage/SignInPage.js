import React from 'react'
import { PropTypes } from 'prop-types'
import { Loader } from 'semantic-ui-react'
import { t, T } from '@dapps/modules/translation/utils'

import { locations } from 'locations'
import SignInNotice from 'components/SignInNotice'
import { isMobile } from 'lib/utils'

import './SignInPage.css'

export default class SignInPage extends React.PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired,
    onNavigate: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isConnected) {
      this.props.onNavigate(locations.parcelMapDetail(0, 0))
    }
  }

  render() {
    const { isLoading } = this.props

    return (
      <div className="SignInPage">
        {isLoading ? (
          <Loader active size="massive" />
        ) : (
          <SignInNotice>
            <p>
              {t('sign_in.intro')}{' '}
              {isMobile() ? (
                <T
                  id="sign_in.options.mobile"
                  values={{
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
                    ),
                    trust_link: (
                      <a
                        href="https://trustwallet.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Trust Wallet
                      </a>
                    )
                  }}
                />
              ) : (
                <T
                  id="sign_in.options.desktop"
                  values={{
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
                  }}
                />
              )}
            </p>
          </SignInNotice>
        )}
      </div>
    )
  }
}
