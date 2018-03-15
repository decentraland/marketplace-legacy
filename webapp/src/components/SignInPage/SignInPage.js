import React from 'react'

import StaticPage from 'components/StaticPage'
import { t, t_html } from 'modules/translation/utils'

export default class SignInPage extends React.PureComponent {
  render() {
    return (
      <StaticPage>
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
        </div>
      </StaticPage>
    )
  }
}
