import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'

import {
  walletType,
  parcelType,
  estateType,
  actionType
} from 'components/types'
import {
  isOnSale,
  canGetMortgage,
  canCreateEstate,
  isBiddeable
} from 'modules/asset/utils'
import { can, ACTIONS } from 'shared/roles'
import { ASSET_TYPES } from 'shared/asset'

export default class Permission extends React.PureComponent {
  static propTypes = {
    wallet: walletType.isRequired,
    asset: PropTypes.oneOfType([parcelType, estateType]).isRequired,
    assetType: PropTypes.oneOf(Object.values(ASSET_TYPES)).isRequired,
    isConnecting: PropTypes.bool,
    children: PropTypes.node.isRequired,
    actions: PropTypes.arrayOf(actionType)
  }

  static defaultProps = {
    actions: []
  }

  extraChecks(action) {
    const { wallet, asset, publications, bids } = this.props

    switch (action) {
      case ACTIONS.bid: {
        return isBiddeable(wallet, asset, bids)
      }
      case ACTIONS.buy:
        return !isOnSale(asset, publications)
      case ACTIONS.cancelSale:
        return isOnSale(asset, publications)
      case ACTIONS.createEstate:
        return canCreateEstate(wallet, asset, publications)
      case ACTIONS.getMortgage:
        return canGetMortgage(wallet, asset, publications)
      default:
        return true
    }
  }

  render() {
    const { wallet, isConnecting, asset, actions, children } = this.props

    if (isConnecting) {
      return (
        <div>
          <Loader active size="tiny" />
        </div>
      )
    }

    for (const action of actions) {
      const hasPermission =
        can(action, wallet.address, asset) && this.extraChecks(action)

      if (!hasPermission) {
        return null
      }
    }
    return children
  }
}
