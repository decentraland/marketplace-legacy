import React from 'react'
import { Link } from 'react-router-dom'

import StaticPage from 'components/StaticPage'

export default class ServerError extends React.PureComponent {
  render() {
    return (
      <StaticPage>
        <h2>
          Uh-oh. <br />
          We couldn’t retrieve information from the server.
        </h2>
        <div className="message">
          <p>Please try again in a few minutes.</p>
          <br />
          <p>
            If the problem persists, contact us at our&nbsp;
            <Link to="https://chat.decentraland.org" target="_blank">
              Community Chat
            </Link>
            &nbsp; or via&nbsp;
            <Link to="https://twitter.com/decentraland" target="_blank">
              Twitter
            </Link>.
          </p>
          <br />
          <p>
            Confused about what&#39;s going on? Check out the&nbsp;
            <Link to="https://wiki.decentraland.org/" target="_blank">
              wiki
            </Link>&nbsp; for answers.
          </p>
        </div>
      </StaticPage>
    )
  }
}
