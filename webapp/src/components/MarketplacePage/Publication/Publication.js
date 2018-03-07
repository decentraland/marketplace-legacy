import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { txUtils } from 'decentraland-commons'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

import { locations } from 'locations'
import { Header, Card, Button } from 'semantic-ui-react'
import ParcelName from 'components/ParcelName'
import AddressLink from 'components/AddressLink'
import ParcelPreview from 'components/ParcelPreview'
import { publicationType } from 'components/types'
import { PUBLICATION_STATUS } from 'modules/publication/utils'
import { formatDate, formatMana } from 'lib/utils'

import './Publication.css'

export default class Publication extends React.PureComponent {
  static propTypes = {
    publication: publicationType,
    debounce: PropTypes.number,
    isOwnerVisible: PropTypes.bool
  }
  static defaultProps = {
    isOwnerVisible: true
  }

  renderButton({ publication, isExpired }) {
    let text = 'View'
    if (publication.status === PUBLICATION_STATUS.sold) {
      text = 'Sold'
    }
    if (publication.status === PUBLICATION_STATUS.canceled) {
      text = 'Canceled'
    }

    const isDisabled =
      isExpired ||
      publication.status !== PUBLICATION_STATUS.open ||
      publication.tx_status !== txUtils.TRANSACTION_STATUS.confirmed

    const button = (
      <Button floated="right" size="tiny" disabled={isDisabled}>
        {text}
      </Button>
    )
    return isDisabled ? (
      button
    ) : (
      <Link to={locations.parcelDetail(publication.x, publication.y)}>
        {button}
      </Link>
    )
  }
  render() {
    const { publication, debounce, isOwnerVisible } = this.props

    const isExpired = publication.expires_at < Date.now()

    return (
      <Card className="Publication">
        <Link to={locations.parcelDetail(publication.x, publication.y)}>
          <div className="preview">
            <ParcelPreview
              x={publication.x}
              y={publication.y}
              debounce={debounce}
              size={18}
            />
          </div>
        </Link>
        <Card.Content className="body">
          <ParcelName x={publication.x} y={publication.y} size="small" />
          <Card.Meta title={formatDate(publication.expires_at)}>
            {isExpired
              ? `Expired ${distanceInWordsToNow(publication.expires_at)} ago`
              : `Expires in ${distanceInWordsToNow(publication.expires_at)}`}
          </Card.Meta>
          {isOwnerVisible && (
            <AddressLink
              address={publication.owner}
              scale={2}
              className="publication-owner"
            />
          )}
        </Card.Content>
        <Card.Content extra>
          <span className="footer">
            <Header size="medium" floated="left" className="price">
              <span className="amount" title={formatMana(publication.price)}>
                {formatMana(publication.price, '')}
              </span>&nbsp;MANA
            </Header>
            {this.renderButton({ publication, isExpired })}
          </span>
        </Card.Content>
      </Card>
    )
  }
}
