import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'semantic-ui-react'

import { bidType } from 'components/types'
import Bid from 'components/Bid'

import './BidCard.css'

export default class BidCard extends React.PureComponent {
  static propTypes = {
    bid: bidType.isRequired,
    isOwner: PropTypes.bool.isRequired
  }

  render() {
    const { bid, isOwner } = this.props
    return (
      <Card className="BidCard">
        <Bid bid={bid} isOwner={isOwner} showAssetDetail={true} />
      </Card>
    )
  }
}
