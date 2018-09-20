import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { txUtils } from 'decentraland-eth'
import { Segment, Grid, Loader } from 'semantic-ui-react'

import { locations } from 'locations'
import TxStatus from 'components/TxStatus'
import EtherscanLink from 'components/EtherscanLink'
import ParcelPreview from 'components/ParcelPreview'
import Mana from 'components/Mana'
import { transactionType } from 'components/types'
import { t, t_html } from '@dapps/modules/translation/utils'
import {
  getMarketplaceAddress,
  getMortgageHelperAddress,
  getMortgageManagerAddress
} from 'modules/wallet/utils'
import { getEtherscanHref } from 'modules/transaction/utils'
import {
  APPROVE_MANA_SUCCESS,
  AUTHORIZE_LAND_SUCCESS,
  TRANSFER_MANA_SUCCESS,
  BUY_MANA_SUCCESS,
  APPROVE_MORTGAGE_FOR_MANA_SUCCESS,
  APPROVE_MORTGAGE_FOR_RCN_SUCCESS
} from 'modules/wallet/actions'
import {
  EDIT_PARCEL_SUCCESS,
  MANAGE_PARCEL_SUCCESS,
  TRANSFER_PARCEL_SUCCESS
} from 'modules/parcels/actions'
import {
  PUBLISH_SUCCESS,
  BUY_SUCCESS,
  CANCEL_SALE_SUCCESS
} from 'modules/publication/actions'
import {
  CREATE_MORTGAGE_SUCCESS,
  CANCEL_MORTGAGE_SUCCESS,
  PAY_MORTGAGE_SUCCESS,
  CLAIM_MORTGAGE_RESOLUTION_SUCCESS
} from 'modules/mortgage/actions'
import {
  CREATE_ESTATE_SUCCESS,
  EDIT_ESTATE_PARCELS_SUCCESS,
  EDIT_ESTATE_METADATA_SUCCESS,
  ADD_PARCELS,
  DELETE_ESTATE_SUCCESS,
  TRANSFER_ESTATE_SUCCESS
} from 'modules/estates/actions'
import { buildCoordinate } from 'shared/parcel'
import { isNewEstate, calculateMapProps } from 'shared/estate'
import { formatDate, formatMana, distanceInWordsToNow } from 'lib/utils'

import './Transaction.css'

export default class Transaction extends React.PureComponent {
  static propTypes = {
    tx: transactionType,
    network: PropTypes.string
  }

  handleTransactionClick = e => {
    if (e.target.nodeName !== 'A' && e.target.nodeName !== 'CANVAS') {
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

  renderMortgageHelperLink() {
    return (
      <EtherscanLink address={getMortgageHelperAddress()}>
        Mortgage helper
      </EtherscanLink>
    )
  }

  renderMortgageManagerLink() {
    return (
      <EtherscanLink address={getMortgageManagerAddress()}>
        Mortgage Manager
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

  renderEstateLink(estate) {
    return (
      <Link to={locations.estateDetail(estate.id)}>{estate.data.name}</Link>
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
            <Link to={locations.profilePageDefault(address)}>{address}</Link>
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
      case MANAGE_PARCEL_SUCCESS: {
        const { x, y, address, revoked } = payload
        return t_html(
          revoked ? 'transaction.manage_revoked' : 'transaction.manage',
          {
            parcel_link: this.renderParcelLink(x, y),
            address_link: (
              <Link to={locations.profilePageDefault(address)}>{address}</Link>
            )
          }
        )
      }

      case TRANSFER_PARCEL_SUCCESS: {
        const { x, y, newOwner } = payload

        return t_html('transaction.transfer', {
          asset_link: this.renderParcelLink(x, y),
          asset_type: t('global.the_parcel').toLowerCase(),
          owner_link: (
            <Link to={locations.profilePageDefault(newOwner)}>{newOwner}</Link>
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
            <EtherscanLink txHash={tx_hash}>
              {t('global.sale').toLowerCase()}
            </EtherscanLink>
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

      case APPROVE_MORTGAGE_FOR_MANA_SUCCESS: {
        return t_html('transaction.mortgage_mana', {
          action: (payload.mana > 0
            ? t('global.authorized')
            : t('global.unauthorized')
          ).toLowerCase(),
          mortgage_contract_link: this.renderMortgageHelperLink()
        })
      }

      case APPROVE_MORTGAGE_FOR_RCN_SUCCESS: {
        return t_html('transaction.mortgage_rcn', {
          action: (payload.rcn > 0
            ? t('global.authorized')
            : t('global.unauthorized')
          ).toLowerCase(),
          mortgage_contract_link: this.renderMortgageManagerLink()
        })
      }
      case CREATE_MORTGAGE_SUCCESS: {
        const { x, y } = payload

        return t_html('transaction.create_mortgage', {
          parcel_link: this.renderParcelLink(x, y)
        })
      }
      case CANCEL_MORTGAGE_SUCCESS: {
        const { x, y } = payload

        return t_html('transaction.cancel_mortgage', {
          parcel_link: this.renderParcelLink(x, y)
        })
      }
      case PAY_MORTGAGE_SUCCESS: {
        const { x, y, amount } = payload

        return t_html('transaction.pay_mortgage', {
          parcel_link: this.renderParcelLink(x, y),
          amount
        })
      }
      case CLAIM_MORTGAGE_RESOLUTION_SUCCESS: {
        const { x, y } = payload

        return t_html('transaction.claim_mortgage_resolution', {
          parcel_link: this.renderParcelLink(x, y)
        })
      }
      case CREATE_ESTATE_SUCCESS: {
        const { estate } = payload
        return t_html('transaction.create_estate', {
          name: estate.data.name
        })
      }
      case EDIT_ESTATE_PARCELS_SUCCESS: {
        const { estate, type, parcels } = payload
        return t_html(
          type === ADD_PARCELS
            ? 'transaction.edit_estate_parcels_added'
            : 'transaction.edit_estate_parcels_removed',
          {
            name: this.renderEstateLink(estate),
            amount: parcels.length
          }
        )
      }
      case EDIT_ESTATE_METADATA_SUCCESS: {
        const { estate } = payload
        return t_html('transaction.edit_estate_metadata', {
          estate_id: this.renderEstateLink(estate),
          name: estate.data.name,
          description: estate.data.description
        })
      }
      case DELETE_ESTATE_SUCCESS: {
        const { estate } = payload
        return t_html('transaction.dissolve_estate', {
          name: estate.data.name
        })
      }
      case TRANSFER_ESTATE_SUCCESS: {
        const { estate, to } = payload

        return t_html('transaction.transfer', {
          asset_link: this.renderEstateLink(estate),
          asset_type: t('global.the_estate').toLowerCase(),
          owner_link: <Link to={locations.profilePage(to)}>{to}</Link>
        })
      }
      default:
        return null
    }
  }

  renderEstatePreview(tx) {
    const size = 5
    const { estate } = tx.payload
    const { center, zoom, pan } = calculateMapProps(estate.data.parcels, size)
    const { x, y } = center

    return (
      <Link
        to={
          isNewEstate(estate)
            ? locations.parcelMapDetail(x, y, buildCoordinate(x, y))
            : locations.estateDetail(estate.id)
        }
      >
        <ParcelPreview
          x={x}
          y={y}
          zoom={zoom}
          width={64}
          height={64}
          size={size}
          panX={pan.x}
          panY={pan.y}
          selected={estate.data.parcels}
        />
      </Link>
    )
  }

  renderParcelPreview(tx) {
    const { x, y } = tx.payload
    return (
      <Link to={locations.parcelMapDetail(x, y, buildCoordinate(x, y))}>
        <ParcelPreview
          x={x}
          y={y}
          width={64}
          height={64}
          size={15}
          selected={{ x, y }}
        />
      </Link>
    )
  }

  renderMANAPreview() {
    return <Mana size={64} scale={1} />
  }

  render() {
    const text = this.renderText()
    if (!text) {
      return null
    }

    const { tx } = this.props

    const isParcelTransaction = [
      EDIT_PARCEL_SUCCESS,
      TRANSFER_PARCEL_SUCCESS,
      PUBLISH_SUCCESS,
      BUY_SUCCESS,
      CANCEL_SALE_SUCCESS,
      MANAGE_PARCEL_SUCCESS,
      CREATE_MORTGAGE_SUCCESS,
      CANCEL_MORTGAGE_SUCCESS,
      PAY_MORTGAGE_SUCCESS,
      CLAIM_MORTGAGE_RESOLUTION_SUCCESS
    ].includes(tx.actionType)

    const isEstateTransaction = [
      CREATE_ESTATE_SUCCESS,
      EDIT_ESTATE_PARCELS_SUCCESS,
      EDIT_ESTATE_METADATA_SUCCESS,
      DELETE_ESTATE_SUCCESS,
      TRANSFER_ESTATE_SUCCESS
    ].includes(tx.actionType)

    const isMANATransaction = !isParcelTransaction && !isEstateTransaction

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
              {isParcelTransaction && this.renderParcelPreview(tx)}
              {isEstateTransaction && this.renderEstatePreview(tx)}
              {isMANATransaction && this.renderMANAPreview()}
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
