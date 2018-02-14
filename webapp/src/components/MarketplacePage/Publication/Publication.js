import React from 'react'
import { Header, Card, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { publicationType } from 'components/types'
import { txUtils } from 'decentraland-commons'
import TxStatus from 'components/TxStatus'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import format from 'date-fns/format'
import './Publication.css'

export default class Publication extends React.PureComponent {
  static propTypes = {
    publication: publicationType
  }
  render() {
    const { publication } = this.props
    const price = (+publication.price).toLocaleString()

    const isExpired = publication.expires_at < Date.now()

    return (
      <Card className="Publication">
        <Card.Content>
          <Link to={`/${publication.x}/${publication.y}`}>
            <Icon name="map" />
            {publication.x},{publication.y}
          </Link>
          <Card.Meta
            title={format(publication.expires_at, 'MMMM Do, YYYY - hh:MMa')}
          >
            {isExpired
              ? `Expired ${distanceInWordsToNow(publication.expires_at)} ago`
              : `Expires in ${distanceInWordsToNow(publication.expires_at)}`}
          </Card.Meta>
          <TxStatus
            txHash={publication.tx_hash}
            txStatus={publication.tx_status}
            className="tx-status"
          />
        </Card.Content>
        <Card.Content extra>
          <span className="footer">
            <Header size="medium" floated="left" className="price">
              <span className="amount" title={price}>
                {price}
              </span>{' '}
              &nbsp;MANA
            </Header>
            <Button
              floated="right"
              size="tiny"
              disabled={
                isExpired ||
                publication.is_sold ||
                publication.tx_status !== txUtils.TRANSACTION_STATUS.confirmed
              }
            >
              {publication.is_sold ? 'Sold' : 'Buy'}
            </Button>
          </span>
        </Card.Content>
      </Card>
    )
  }
}
