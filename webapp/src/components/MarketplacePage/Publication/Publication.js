import React from 'react'
import { Header, Card, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { publicationType } from 'components/types'
import { txUtils } from 'decentraland-commons'
import EtherscanLink from 'components/EtherscanLink'
import numeral from 'numeral'
import moment from 'moment'
import './Publication.css'

export default class Publication extends React.PureComponent {
  static propTypes = {
    publication: publicationType
  }
  render() {
    const { publication } = this.props
    let iconName = 'check circle outline'
    let iconTooltip = 'Transaction confirmed'
    if (publication.tx_status === txUtils.TRANSACTION_STATUS.pending) {
      iconName = 'warning sign'
      iconTooltip = 'Transaction pending'
    } else if (publication.tx_status === txUtils.TRANSACTION_STATUS.failed) {
      iconName = 'remove circle outline'
      iconTooltip = 'Transaction failed'
    }
    const isExpired = publication.expires_at < Date.now()
    return (
      <Card className="Publication">
        <Card.Content>
          <Link to={`/${publication.x}/${publication.y}`}>
            <Icon name="map" />
            {publication.x},{publication.y}
          </Link>
          <Card.Meta>
            {isExpired
              ? `Expired`
              : `Expires ${moment(publication.expires_at).fromNow()}`}
          </Card.Meta>
          <span
            data-balloon-pos="up"
            data-balloon={iconTooltip}
            className="tx-icon"
          >
            <EtherscanLink txHash={publication.tx_hash}>
              <Icon name={iconName} className={publication.tx_status} />
            </EtherscanLink>
          </span>
        </Card.Content>
        <Card.Content extra>
          <span className="footer">
            <Header size="medium" floated="left" className="price">
              {numeral(publication.price).format('0,0.00')} MANA
            </Header>
            <Button
              floated="right"
              size="tiny"
              disabled={
                isExpired ||
                publication.sold ||
                publication.tx_status !== txUtils.TRANSACTION_STATUS.confirmed
              }
            >
              {publication.sold ? 'Sold' : 'Buy'}
            </Button>
          </span>
        </Card.Content>
      </Card>
    )
  }
}
