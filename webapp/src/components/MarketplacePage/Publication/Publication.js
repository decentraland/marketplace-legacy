import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { txUtils } from 'decentraland-commons'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import format from 'date-fns/format'

import { locations } from 'locations'
import { Header, Card, Button, Icon } from 'semantic-ui-react'
import TxStatus from 'components/TxStatus'
import ParcelPreview from 'components/ParcelPreview'
import { publicationType } from 'components/types'

import './Publication.css'

export default class Publication extends React.PureComponent {
  static propTypes = {
    publication: publicationType,
    debounce: PropTypes.number
  }
  render() {
    const { publication, debounce } = this.props
    const price = (+publication.price).toLocaleString()

    const isExpired = publication.expires_at < Date.now()

    return (
      <Card className="Publication">
        <Link to={locations.parcelDetail(publication.x, publication.y)}>
          <div className="preview">
            <ParcelPreview
              x={publication.x}
              y={publication.y}
              debounce={debounce}
            />
          </div>
        </Link>
        <Card.Content className="body">
          <Link to={locations.parcelMapDetail(publication.x, publication.y)}>
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
          <TxStatus.Icon
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
            <Link to={locations.parcelDetail(publication.x, publication.y)}>
              <Button
                floated="right"
                size="tiny"
                disabled={
                  isExpired ||
                  publication.is_sold ||
                  publication.tx_status !== txUtils.TRANSACTION_STATUS.confirmed
                }
              >
                {publication.is_sold ? 'Sold' : 'View'}
              </Button>
            </Link>
          </span>
        </Card.Content>
      </Card>
    )
  }
}
