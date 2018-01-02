import React from 'react'

import StaticPage from './StaticPage'

export default function WalletErrorPage() {
  return (
    <StaticPage>
      <h2>
        Uh-oh. <br />
        We couldn’t retrieve your wallet information.
      </h2>

      <div className="message">
        <p>
          Please make sure your&nbsp;
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
          &nbsp;account is connected and unlocked, then refresh the page.
        </p>
        <br />
        <p>
          If you’ve just installed Metamask or Mist, restarting your browser
          usually fixes the problem.
        </p>
        <br />
        <p>
          Confused about what&#39;s going on? Check out the&nbsp;
          <a
            href="https://wiki.decentraland.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            wiki
          </a>&nbsp; for answers.
        </p>
        <br />
        <p>
          You can also check out the current status of the auction &nbsp;
          <a
            href="https://auction.decentraland.org/stats"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>.
        </p>
        <br />
      </div>

      <a className="btn btn-primary" href="/">
        Retry
      </a>
    </StaticPage>
  )
}
