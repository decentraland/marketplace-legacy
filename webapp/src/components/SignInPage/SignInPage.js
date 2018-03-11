import React from 'react'

import StaticPage from 'components/StaticPage'

export default class SignInPage extends React.PureComponent {
  render() {
    return (
      <StaticPage>
        <div className="message">
          <p>
            Download&nbsp;
            <a
              href="https://metamask.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              Metamask
            </a>
            &nbsp; or&nbsp;
            <a
              href="https://github.com/ethereum/mist"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mist
            </a>
            &nbsp; or access with your&nbsp;<a
              href="https://www.ledgerwallet.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ledger Nano S
            </a>{' '}
            to use the Marketplace.
          </p>
          <p>Make sure your account is unlocked.</p>
        </div>
      </StaticPage>
    )
  }
}
