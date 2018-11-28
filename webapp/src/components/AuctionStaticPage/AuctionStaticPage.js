import React from 'react'

import ParcelPreview from 'components/ParcelPreview'

import './AuctionStaticPage.css'

export default class AuctionStaticPage extends React.PureComponent {
  render() {
    return (
      <div className="AuctionStaticPage">
        <ParcelPreview />
        <div className="component-wrapper">{this.props.children}</div>
      </div>
    )
  }
}
