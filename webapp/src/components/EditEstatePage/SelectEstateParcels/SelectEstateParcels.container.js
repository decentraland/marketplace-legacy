import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import { ASSET_TYPES } from 'shared/asset'
import {
  createEstateRequest,
  editEstateParcelsRequest,
  editEstateMetadataRequest
} from 'modules/estates/actions'
import { getMatchParams } from 'modules/location/selectors'
import { getWallet } from 'modules/wallet/selectors'
import { getData as getParcels } from 'modules/parcels/selectors'
import {
  getData as getEstates,
  isEstateTransactionIdle
} from 'modules/estates/selectors'
import { getWalletBidsByAsset } from 'modules/bid/selectors'
import SelectEstateParcels from './SelectEstateParcels'

const mapState = (state, { pristineEstate }) => {
  const wallet = getWallet(state)

  // TODO: AllParcels is here because we're using estate.data.parcels which comes from the API.
  //       Maybe, the API should return estate.parcels, the reducer should split this into their domains and a selector should put it back together.
  return {
    wallet,
    allParcels: getParcels(state),
    isTxIdle: isEstateTransactionIdle(state),
    bids: pristineEstate
      ? getWalletBidsByAsset(state, pristineEstate, ASSET_TYPES.estate)
      : []
  }
}

const mapDispatch = (dispatch, { pristineEstate }) => {
  const { data, id } = pristineEstate
  const { x, y } = data.parcels[0]

  return {
    onCreateCancel: () => dispatch(navigateTo(locations.parcelDetail(x, y))),
    onDeleteEstate: () => dispatch(navigateTo(locations.deleteEstate(id))),
    onCancel: () => dispatch(goBack())
  }
}

export default connect(mapState, mapDispatch)(SelectEstateParcels)
