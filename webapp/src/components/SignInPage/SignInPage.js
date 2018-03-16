import React from 'react'
import { PropTypes } from 'prop-types'

import { locations } from 'locations'
import { Button, Loader } from 'semantic-ui-react'
import StaticPage from 'components/StaticPage'
import { t, t_html } from 'modules/translation/utils'

export default class SignInPage extends React.PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired,
    onConnect: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isConnected) {
      this.props.onNavigate(locations.settings)
    }
  }

  handleRetry = () => {
    this.props.onConnect()
  }

  render() {
    const { isLoading } = this.props

    return (
      <StaticPage>
        {isLoading ? (
          <Loader active size="massive" />
        ) : (
          <div className="message">
            <p>
              {t_html('sign_in.options', {
                metamask_link: (
                  <a
                    href="https://metamask.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Metamask
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
            <p>{t('sign_in.account_unlocked')}</p>
            <br />
            <Button type="button" primary onClick={this.handleRetry}>
              {t('global.retry')}
            </Button>
          </div>
        )}
      </StaticPage>
    )
  }
}
