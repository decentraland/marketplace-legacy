import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { txUtils } from 'decentraland-eth'

import { locations } from 'locations'
import { Segment, Grid, Loader } from 'semantic-ui-react'
import TxStatus from 'components/TxStatus'
import EtherscanLink from 'components/EtherscanLink'
import ParcelPreview from 'components/ParcelPreview'
import Mana from 'components/Mana'
import { transactionType } from 'components/types'
import {
  formatDate,
  formatMana,
  distanceInWordsToNow,
  buildCoordinate
} from 'lib/utils'
import { getMarketplaceAddress } from 'modules/wallet/utils'
import { t, t_html } from 'modules/translation/utils'
import { getEtherscanHref } from 'modules/transaction/utils'

import {
  APPROVE_MANA_SUCCESS,
  AUTHORIZE_LAND_SUCCESS,
  TRANSFER_MANA_SUCCESS,
  BUY_MANA_SUCCESS
} from 'modules/wallet/actions'
import { EDIT_PARCEL_SUCCESS } from 'modules/parcels/actions'
import { TRANSFER_PARCEL_SUCCESS } from 'modules/transfer/actions'
import {
  PUBLISH_SUCCESS,
  BUY_SUCCESS,
  CANCEL_SALE_SUCCESS
} from 'modules/publication/actions'

import './Transaction.css'

export default class Transaction extends React.PureComponent {
  static propTypes = {
    tx: transactionType,
    network: PropTypes.string
  }

  handleTransactionClick = e => {
    if (e.target.nodeName !== 'A') {
      const { tx, network } = this.props
      const href = getEtherscanHref({ txHash: tx.hash }, network)
      window.open(href, '_blank')
    }
  }

  renderMarketplaceLink() {
    return (
      <EtherscanLink address={getMarketplaceAddress()}>
        Marketplace
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

  renderText() {
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
      case TRANSFER_MANA_SUCCESS: {
        const { address, mana } = payload
        return t_html('transaction.transfer_mana', {
          mana: formatMana(mana, ''),
          address_link: (
            <Link to={locations.profilePage(address)}>{address}</Link>
          )
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
      case BUY_MANA_SUCCESS: {
        const { mana } = payload

        return t_html('transaction.buy_mana', {
          mana: formatMana(mana, '')
        })
      }
      default:
        return null
    }
  }

  render() {
    const { tx } = this.props
    const { x, y } = tx.payload
    const text = this.renderText()

    if (!text) {
      return null
    }

    const isParcelTransaction = [
      EDIT_PARCEL_SUCCESS,
      TRANSFER_PARCEL_SUCCESS,
      PUBLISH_SUCCESS,
      BUY_SUCCESS,
      CANCEL_SALE_SUCCESS
    ].includes(tx.actionType)

    return (
      <Segment size="large" vertical>
        <Grid>
          <Grid.Column
            className="Transaction"
            onClick={this.handleTransactionClick}
          >
            {tx.status === txUtils.TRANSACTION_STATUS.pending ? (
              <Loader active size="mini" />
            ) : (
              <div className="mini circle" />
            )}

            <div className="transaction-avatar">
              {isParcelTransaction ? (
                <Link
                  to={locations.parcelMapDetail(x, y, buildCoordinate(x, y))}
                >
                  <ParcelPreview
                    x={x}
                    y={y}
                    width={64}
                    height={64}
                    size={15}
                    selected={{ x, y }}
                  />
                </Link>
              ) : (
                <Mana size={64} scale={1} />
              )}
            </div>

            <div className="transaction-text">
              <TxStatus.Icon
                className="transaction-icon"
                txHash={tx.hash}
                txStatus={tx.status}
              />
              <div>{text}</div>
              <div
                className="transaction-timestamp"
                data-balloon-pos="up"
                data-balloon={formatDate(tx.timestamp)}
              >
                {distanceInWordsToNow(tx.timestamp)}
              </div>
            </div>
          </Grid.Column>
        </Grid>
      </Segment>
    )
  }
}
