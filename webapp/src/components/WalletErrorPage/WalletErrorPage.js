import React from 'react'

import { locations } from 'locations'
import { Button } from 'semantic-ui-react'
import StaticPage from 'components/StaticPage'

export default class WalletErrorPage extends React.PureComponent {
  render() {
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
        </div>

        <Button as="a" href={locations.root} primary={true}>
          RETRY
        </Button>
      </StaticPage>
    )
  }
}
