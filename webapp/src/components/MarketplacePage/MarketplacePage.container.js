import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { isLoading } from 'modules/publication/selectors'
import { getAssets, getTotals } from 'modules/ui/marketplace/selectors'
import { navigateTo } from '@dapps/modules/location/actions'
import { fetchPublicationsRequest } from 'modules/publication/actions'
import { Pagination } from 'lib/Pagination'
import { ASSET_TYPES } from 'shared/asset'
import { getOptionsFromRouter } from './utils'

import MarketplacePage from './MarketplacePage'

const mapState = (state, { location }) => {
  let {
    limit,
    offset,
    sortBy,
    sortOrder,
    assetType,
    status
  } = getOptionsFromRouter(location)
  const assets = getAssets(state)
  const totals = getTotals(state)

  const isEmpty = assets.length === 0
  const pagination = new Pagination(totals[assetType])
  const page = pagination.getCurrentPage(offset)
  const pages = pagination.getPageCount()

  if (!Object.values(ASSET_TYPES).includes(assetType)) {
    assetType = ASSET_TYPES.parcel
  }

  return {
    limit,
    offset,
    sortBy,
    sortOrder,
    status,
    page,
    pages,
    assets,
    assetType,
    isEmpty,
    totals,
    isLoading: isLoading(state)
  }
}

const mapDispatch = (dispatch, { location }) => {
  return {
    onFetchPublications: assetType => {
      let options = getOptionsFromRouter(location)
      if (assetType) {
        options.assetType = assetType // override router option
      }
      dispatch(fetchPublicationsRequest(options))
    },
    onNavigate: url => dispatch(navigateTo(url))
  }
}

export default withRouter(connect(mapState, mapDispatch)(MarketplacePage))
