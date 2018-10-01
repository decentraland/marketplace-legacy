import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Segment, Grid } from 'semantic-ui-react'
import { locations } from 'locations'
import EtherscanLink from 'components/EtherscanLink'
import ParcelPreview from 'components/ParcelPreview'
import Mana from 'components/Mana'
import { transactionType } from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import { getContractAddress } from 'modules/wallet/utils'
import { getEtherscanHref } from '@dapps/modules/transaction/utils'
import {
  ALLOW_TOKEN_SUCCESS,
  APPROVE_TOKEN_SUCCESS
} from 'modules/authorization/actions'
import { TRANSFER_MANA_SUCCESS, BUY_MANA_SUCCESS } from 'modules/wallet/actions'
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
import { ASSET_TYPES } from 'shared/asset'
import { token } from 'lib/token'
import { formatDate, formatMana, distanceInWordsToNow } from 'lib/utils'
import { hasEtherscanLink, getHash } from '../utils'
import './Transaction.css'
import Status from './Status'

export default class Transaction extends React.PureComponent {
  static propTypes = {
    tx: transactionType,
    network: PropTypes.string
  }

  handleTransactionClick = e => {
    const { tx } = this.props
    if (
      e.target.nodeName !== 'A' &&
      e.target.nodeName !== 'CANVAS' &&
      hasEtherscanLink(tx)
    ) {
      const { tx, network } = this.props
      const href = getEtherscanHref({ txHash: getHash(tx) }, network)
      window.open(href, '_blank')
    }
  }

  renderContractLink(contractName) {
    return (
      <EtherscanLink address={getContractAddress(contractName)}>
        {contractName}
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

  getAssetLink(asset) {
    if (asset.type === ASSET_TYPES.parcel) {
      return this.renderParcelLink(asset.x, asset.y)
    } else if (asset.type === ASSET_TYPES.estate) {
      return this.renderEstateLink(asset)
    }
  }

  renderText() {
    const { tx } = this.props
    const { payload } = tx

    switch (tx.actionType) {
      case ALLOW_TOKEN_SUCCESS: {
        const { amount, contractName, tokenContractName } = payload
        const tkey =
          amount > 0 ? 'authorization.allowed' : 'authorization.disallowed'

        return (
          <T
            id={tkey}
            values={{
              contract_link: this.renderContractLink(contractName),
              symbol: token.getSymbolByContractName(tokenContractName)
            }}
          />
        )
      }
      case APPROVE_TOKEN_SUCCESS: {
        const { isApproved, contractName, tokenContractName } = payload
        const tkey = isApproved
          ? 'authorization.approved'
          : 'authorization.disapproved'

        return (
          <T
            id={tkey}
            values={{
              contract_link: this.renderContractLink(contractName),
              symbol: token.getSymbolByContractName(tokenContractName)
            }}
          />
        )
      }
      case TRANSFER_MANA_SUCCESS: {
        const { address, mana } = payload
        return (
          <T
            id="transaction.transfer_mana"
            values={{
              mana: formatMana(mana, ''),
              address_link: (
                <Link to={locations.profilePageDefault(address)}>
                  {address}
                </Link>
              )
            }}
          />
        )
      }
      case EDIT_PARCEL_SUCCESS: {
        const { x, y, data } = payload
        const { name, description } = data

        return (
          <T
            id="transaction.edit"
            values={{
              parcel_link: this.renderParcelLink(x, y),
              name: <i>{name}</i>,
              description: <i>{description}</i>
            }}
          />
        )
      }
      case MANAGE_PARCEL_SUCCESS: {
        const { x, y, address, revoked } = payload
        return (
          <T
            id={revoked ? 'transaction.manage_revoked' : 'transaction.manage'}
            values={{
              parcel_link: this.renderParcelLink(x, y),
              address_link: (
                <Link to={locations.profilePageDefault(address)}>
                  {address}
                </Link>
              )
            }}
          />
        )
      }
      case TRANSFER_PARCEL_SUCCESS: {
        const { x, y, newOwner } = payload

        return (
          <T
            id="transaction.transfer"
            values={{
              asset_link: this.renderParcelLink(x, y),
              asset_type: t('global.the_parcel').toLowerCase(),
              owner_link: (
                <Link to={locations.profilePageDefault(newOwner)}>
                  {newOwner}
                </Link>
              )
            }}
          />
        )
      }
      case PUBLISH_SUCCESS: {
        return (
          <T
            id="transaction.publish"
            values={{ parcel_link: this.getAssetLink(payload) }}
          />
        )
      }
      case BUY_SUCCESS: {
        return (
          <T
            id="transaction.buy"
            values={{ parcel_link: this.getAssetLink(payload) }}
          />
        )
      }
      case CANCEL_SALE_SUCCESS: {
        return (
          <T
            id="transaction.cancel"
            values={{
              publication_link: (
                <EtherscanLink txHash={payload.tx_hash}>
                  {t('global.sale').toLowerCase()}
                </EtherscanLink>
              ),
              parcel_link: this.getAssetLink(payload)
            }}
          />
        )
      }
      case BUY_MANA_SUCCESS: {
        const { mana } = payload

        return (
          <T
            id="transaction.buy_mana"
            values={{ mana: formatMana(mana, '') }}
          />
        )
      }
      case CREATE_MORTGAGE_SUCCESS: {
        const { x, y } = payload

        return (
          <T
            id="transaction.create_mortgage"
            values={{ parcel_link: this.renderParcelLink(x, y) }}
          />
        )
      }
      case CANCEL_MORTGAGE_SUCCESS: {
        const { x, y } = payload

        return (
          <T
            id="transaction.cancel_mortgage"
            values={{ parcel_link: this.renderParcelLink(x, y) }}
          />
        )
      }
      case PAY_MORTGAGE_SUCCESS: {
        const { x, y, amount } = payload

        return (
          <T
            id="transaction.pay_mortgage"
            values={{
              parcel_link: this.renderParcelLink(x, y),
              amount
            }}
          />
        )
      }
      case CLAIM_MORTGAGE_RESOLUTION_SUCCESS: {
        const { x, y } = payload

        return (
          <T
            id="transaction.claim_mortgage_resolution"
            values={{
              parcel_link: this.renderParcelLink(x, y)
            }}
          />
        )
      }
      case CREATE_ESTATE_SUCCESS: {
        const { estate } = payload
        return (
          <T
            id="transaction.create_estate"
            values={{ name: estate.data.name }}
          />
        )
      }
      case EDIT_ESTATE_PARCELS_SUCCESS: {
        const { estate, type, parcels } = payload
        return (
          <T
            id={
              type === ADD_PARCELS
                ? 'transaction.edit_estate_parcels_added'
                : 'transaction.edit_estate_parcels_removed'
            }
            values={{
              name: this.renderEstateLink(estate),
              amount: parcels.length
            }}
          />
        )
      }
      case EDIT_ESTATE_METADATA_SUCCESS: {
        const { estate } = payload
        return (
          <T
            id="transaction.edit_estate_metadata"
            values={{
              estate_id: this.renderEstateLink(estate),
              name: estate.data.name,
              description: estate.data.description
            }}
          />
        )
      }
      case DELETE_ESTATE_SUCCESS: {
        const { estate } = payload
        return (
          <T
            id="transaction.dissolve_estate"
            values={{ name: estate.data.name }}
          />
        )
      }
      case TRANSFER_ESTATE_SUCCESS: {
        const { estate, to } = payload

        return (
          <T
            id="transaction.transfer"
            values={{
              asset_link: this.renderEstateLink(estate),
              asset_type: t('global.the_estate').toLowerCase(),
              owner_link: <Link to={locations.profilePage(to)}>{to}</Link>
            }}
          />
        )
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
          width={48}
          height={48}
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
          width={48}
          height={48}
          size={9.6}
          selected={{ x, y }}
        />
      </Link>
    )
  }

  renderMANAPreview() {
    return <Mana size={48} scale={1} />
  }

  renderAssetPreview(tx) {
    const asset = tx.payload
    if (asset.type === ASSET_TYPES.parcel) {
      return this.renderParcelPreview(tx)
    } else if (asset.type === ASSET_TYPES.estate) {
      // renderEstatePreview expects a property "estate" inside the tx payload
      return this.renderEstatePreview({
        payload: {
          estate: tx.payload
        }
      })
    }
  }

  render() {
    const text = this.renderText()
    if (!text) {
      return null
    }

    const { tx } = this.props

    const classnames = `Transaction ${
      hasEtherscanLink(tx) ? 'with-link' : ''
    }`.trim()

    const isAssetTransaction = [
      PUBLISH_SUCCESS,
      CANCEL_SALE_SUCCESS,
      BUY_SUCCESS
    ].includes(tx.actionType)

    const isParcelTransaction = [
      EDIT_PARCEL_SUCCESS,
      TRANSFER_PARCEL_SUCCESS,
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

    const isMANATransaction =
      !isAssetTransaction && !isParcelTransaction && !isEstateTransaction

    return (
      <Segment size="large" vertical>
        <Grid>
          <Grid.Column
            className={classnames}
            onClick={this.handleTransactionClick}
          >
            <div className="transaction-container">
              <div className="transaction-container-left">
                <div className="transaction-avatar">
                  {isAssetTransaction && this.renderAssetPreview(tx)}
                  {isParcelTransaction && this.renderParcelPreview(tx)}
                  {isEstateTransaction && this.renderEstatePreview(tx)}
                  {isMANATransaction && this.renderMANAPreview()}
                </div>

                <div className="transaction-text-container">
                  <div className="transaction-text">{text}.</div>
                  <div
                    className="transaction-timestamp"
                    data-balloon-pos="up"
                    data-balloon={formatDate(tx.timestamp)}
                  >
                    {distanceInWordsToNow(tx.timestamp)}
                  </div>
                </div>
              </div>
              <div className="transaction-container-right">
                <Status tx={tx} />
              </div>
            </div>
          </Grid.Column>
        </Grid>
      </Segment>
    )
  }
}
