import React from 'react'
import { Link } from 'react-router-dom'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

import { locations } from 'locations'
import { Segment, Grid } from 'semantic-ui-react'
import TxStatus from 'components/TxStatus'
import EtherscanLink from 'components/EtherscanLink'
import { transactionType } from 'components/types'
import { formatMana, formatDate } from 'lib/utils'

import { getMarketplaceAddress } from 'modules/wallet/utils'
import {
  APPROVE_MANA_SUCCESS,
  AUTHORIZE_LAND_SUCCESS
} from 'modules/wallet/actions'
import { EDIT_PARCEL_SUCCESS } from 'modules/parcels/actions'
import { TRANSFER_PARCEL_SUCCESS } from 'modules/transfer/actions'
import { PUBLISH_SUCCESS } from 'modules/publication/actions'

import './Transaction.css'

export default class Transaction extends React.PureComponent {
  static propTypes = {
    tx: transactionType
  }

  renderTextFragment() {
    const { tx } = this.props
    const { payload } = tx

    switch (tx.actionType) {
      case APPROVE_MANA_SUCCESS:
        return (
          <React.Fragment>
            You approved {formatMana(payload.mana)} to be used by the&nbsp;
            <EtherscanLink address={getMarketplaceAddress()}>
              Marketplace contract
            </EtherscanLink>
          </React.Fragment>
        )
      case AUTHORIZE_LAND_SUCCESS:
        return (
          <React.Fragment>
            You have {payload.isAuthorized ? 'authorized' : 'deauthorized'}
            &nbsp;the&nbsp;
            <EtherscanLink address={getMarketplaceAddress()}>
              Marketplace contract
            </EtherscanLink>&nbsp; to operate LAND on your behalf
          </React.Fragment>
        )
      case EDIT_PARCEL_SUCCESS: {
        const { x, y, data } = payload
        const { name, description } = data
        return (
          <React.Fragment>
            You edited
            <Link to={locations.parcelDetail(x, y)}>
              {x}, {y}
            </Link>&nbsp; with the name &quot;<i>{name}</i>&quot; and
            description &quot;<i>{description}</i>&quot;
          </React.Fragment>
        )
      }
      case TRANSFER_PARCEL_SUCCESS: {
        const { x, y, newOwner } = payload
        return (
          <React.Fragment>
            You transfered&nbsp;
            <Link to={locations.parcelDetail(x, y)}>
              {x}, {y}
            </Link>&nbsp;to&nbsp;
            <Link to={locations.profilePage(newOwner)}>{newOwner}</Link>
          </React.Fragment>
        )
      }
      case PUBLISH_SUCCESS: {
        const { x, y } = payload
        return (
          <React.Fragment>
            You published&nbsp;
            <Link to={locations.parcelDetail(x, y)}>
              {x}, {y}
            </Link>
          </React.Fragment>
        )
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
          <Grid.Column width={1}>
            <TxStatus.Icon txHash={tx.hash} txStatus={tx.status} />
          </Grid.Column>
          <Grid.Column mobile={14} tablet={14} computer={12} className="text">
            {textFragment}
          </Grid.Column>
          <Grid.Column textAlign="right" only="computer" width={3}>
            <span
              className="timestamp"
              data-balloon-pos="up"
              data-balloon={formatDate(tx.timestamp)}
            >
              {distanceInWordsToNow(tx.timestamp)}
            </span>
          </Grid.Column>
        </Grid>
      </Segment>
    )
  }
}
