import React from 'react'

import AtlasPage from 'components/AtlasPage'

import './AuctionStaticPage.css'

export default class AuctionStaticPage extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <AtlasPage />
        <div className="AuctionStaticPage">
          <div className="component-wrapper">{this.props.children}</div>
        </div>
      </React.Fragment>
    )
  }
}
