export const PERMISSIONS = {
  owner: 'owner',
  operator: 'operator',
  updateOperator: 'updateOperator',
  operatorForAll: 'operatorForAll',
  updateManager: 'updateManager'
}

export const ACTIONS = {
  transfer: 'transfer',
  createEstate: 'createEstate',
  sell: 'sell',
  bid: 'bid',
  cancelSale: 'cancelSale',
  getMortgage: 'getMortgage',
  setOperatorForAll: 'setOperatorForAll',
  setUpdateOperator: 'setUpdateOperator',
  setUpdateManager: 'setUpdateManager',
  setOperator: 'setOperator',
  updateMetadata: 'updateMetadata'
}

export function can(action, address, asset) {
  let requiredPermissions = []

  switch (action) {
    case ACTIONS.bid:
    case ACTIONS.buy:
    case ACTIONS.getMortgage:
      // WARN: break early here. In this cases we check the lack of a permission
      return !isOwner(address, asset)
    case ACTIONS.sell:
    case ACTIONS.setOperator:
      requiredPermissions = [PERMISSIONS.owner]
      break
    case ACTIONS.transfer:
    case ACTIONS.createEstate:
      requiredPermissions = [
        PERMISSIONS.owner,
        PERMISSIONS.operatorForAll,
        PERMISSIONS.operator
      ]
      break
    case ACTIONS.setUpdateOperator:
      requiredPermissions = [
        PERMISSIONS.owner,
        PERMISSIONS.operatorForAll,
        PERMISSIONS.updateManager,
        PERMISSIONS.operator
      ]
      break
    case ACTIONS.setUpdateManager:
      requiredPermissions = [PERMISSIONS.owner, PERMISSIONS.operatorForAll]
      break
    case ACTIONS.updateMetadata:
      requiredPermissions = [
        PERMISSIONS.owner,
        PERMISSIONS.operatorForAll,
        PERMISSIONS.updateManager,
        PERMISSIONS.updateOperator,
        PERMISSIONS.operator
      ]
      break
    default:
      throw new Error(`Unknown action ${action}`)
  }

  const permissions = getPermisions(address, asset)
  return permissions.includes(permission =>
    requiredPermissions.includes(permission)
  )
}

export function hasAssetPermission(permission, address, asset) {
  switch (permission) {
    case ACTIONS.transfer:
      break
    case ACTIONS.sell:
      break
    case ACTIONS.setUpdateOperator:
      break
    case ACTIONS.setOperator:
      break
    case ACTIONS.updateMetadata:
      break
    default:
      throw new Error(`Unknown permission ${permission}`)
  }
}

export function hasAddressPermission(permission, address, otherAddress) {
  switch (permission) {
    case ACTIONS.setOperatorForAll:
      break
    case ACTIONS.setUpdateManager:
      break
    default:
      throw new Error(`Unknown permission ${permission}`)
  }
}

export function getPermisions(address, asset) {
  if (!address || !asset) {
    return []
  }

  const permissions = []
  if (address === asset.owner) {
    permissions.push(PERMISSIONS.owner)
  }
  if (address === asset.operator) {
    permissions.push(PERMISSIONS.operator)
  }
  if (address === asset.updateOperator) {
    permissions.push(PERMISSIONS.updateOperator)
  }
  if (asset.operatorsForAll.includes(address)) {
    permissions.push(PERMISSIONS.operatorForAll)
  }
  if (asset.updateManagers.includes(address)) {
    permissions.push(PERMISSIONS.updateManagers)
  }
  return permissions
}

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

/**
 * Check if an owneable item is owned by an address
 * @param  {string}  address
 * @param  {object}  owneable - object with an `owner` property
 * @return {Boolean}
 */
export function isOwner(address, owneable) {
  return address && owneable && address === owneable.owner
}
