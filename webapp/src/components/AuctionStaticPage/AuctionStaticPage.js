import React from 'react'

import AtlasPage from 'components/AtlasPage'

import './AuctionStaticPage.css'

export default class AuctionStaticPage extends React.PureComponent {
  render() {
    return (
      <div className="AuctionStaticPage">
        <AtlasPage />
        <div className="component-wrapper">{this.props.children}</div>
      </div>
    )
  }
}
