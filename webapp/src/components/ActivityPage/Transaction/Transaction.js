import React from 'react'
import { Link } from 'react-router-dom'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

import { locations } from 'locations'
import { Segment, Grid } from 'semantic-ui-react'
import TxStatus from 'components/TxStatus'
import EtherscanLink from 'components/EtherscanLink'
import { transactionType } from 'components/types'
import { formatDate } from 'lib/utils'

import { getMarketplaceAddress } from 'modules/wallet/utils'
import {
  APPROVE_MANA_SUCCESS,
  AUTHORIZE_LAND_SUCCESS
} from 'modules/wallet/actions'
import { EDIT_PARCEL_SUCCESS } from 'modules/parcels/actions'
import { TRANSFER_PARCEL_SUCCESS } from 'modules/transfer/actions'
import {
  PUBLISH_SUCCESS,
  BUY_SUCCESS,
  CANCEL_SALE_SUCCESS
} from 'modules/publication/actions'
import { t, t_html } from 'modules/translation/utils'

import './Transaction.css'

export default class Transaction extends React.PureComponent {
  static propTypes = {
    tx: transactionType
  }

  renderMarketplaceLink() {
    return (
      <EtherscanLink address={getMarketplaceAddress()}>
        Marketplace contract
      </EtherscanLink>
    )
  }

  renderParcelLink(x, y) {
    return (
      <Link to={locations.parcelDetail(x, y)}>
        {x}, {y}
      </Link>
    )
  }

  renderTextFragment() {
    const { tx } = this.props
    const { payload } = tx

    switch (tx.actionType) {
      case APPROVE_MANA_SUCCESS: {
        const tkey =
          payload.mana > 0 ? 'transaction.approved' : 'transaction.disapproved'

        return t_html(tkey, {
          marketplace_contract_link: this.renderMarketplaceLink()
        })
      }
      case AUTHORIZE_LAND_SUCCESS: {
        const action = payload.isAuthorized
          ? t('global.authorized')
          : t('global.unauthorized')

        return t_html('transaction.authorize', {
          action: action.toLowerCase(),
          marketplace_contract_link: this.renderMarketplaceLink()
        })
      }
      case EDIT_PARCEL_SUCCESS: {
        const { x, y, data } = payload
        const { name, description } = data

        return t_html('transaction.edit', {
          parcel_link: this.renderParcelLink(x, y),
          name: <i>{name}</i>,
          description: <i>{description}</i>
        })
      }
      case TRANSFER_PARCEL_SUCCESS: {
        const { x, y, newOwner } = payload

        return t_html('transaction.transfer', {
          parcel_link: this.renderParcelLink(x, y),
          owner_link: (
            <Link to={locations.profilePage(newOwner)}>{newOwner}</Link>
          )
        })
      }
      case PUBLISH_SUCCESS: {
        const { x, y } = payload

        return t_html('transaction.publish', {
          parcel_link: this.renderParcelLink(x, y)
        })
      }
      case BUY_SUCCESS: {
        const { x, y } = payload

        return t_html('transaction.buy', {
          parcel_link: this.renderParcelLink(x, y)
        })
      }
      case CANCEL_SALE_SUCCESS: {
        const { tx_hash, x, y } = payload

        return t_html('transaction.cancel', {
          publication_link: (
            <EtherscanLink txHash={tx_hash}>publication</EtherscanLink>
          ),
          parcel_link: this.renderParcelLink(x, y)
        })
      }
      default:
        return null
    }
  }

  render() {
    const { tx } = this.props
    const textFragment = this.renderTextFragment()

    if (!textFragment) {
      return null
    }

    return (
      <Segment size="large" className="Transaction" vertical>
        <Grid>
          <Grid.Column mobile={15} tablet={15} computer={13} className="text">
            <TxStatus.Icon txHash={tx.hash} txStatus={tx.status} />
            {textFragment}
            <div
              className="timestamp"
              data-balloon-pos="up"
              data-balloon={formatDate(tx.timestamp)}
            >
              {distanceInWordsToNow(tx.timestamp)}
            </div>
          </Grid.Column>
        </Grid>
      </Segment>
    )
  }
}
