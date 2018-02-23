import { connect } from 'react-redux'

import { getWallet } from 'modules/wallet/selectors'
import { isLoading } from 'modules/ui/loading/selectors'
import { isLoading as isLoadingParcels } from 'modules/parcels/selectors'
import { isOpen } from 'modules/ui/sidebar/selectors'
import { openSidebar, closeSidebar } from 'modules/ui/sidebar/actions'

import Sidebar from './Sidebar'

const mapState = state => {
  const wallet = getWallet(state)
  return {
    address: wallet.address,
    balance: wallet.balance,
    isLoading: isLoading(state) || isLoadingParcels(state),
    isOpen: isOpen(state)
  }
}

const mapDispatch = dispatch => ({
  onOpen: () => dispatch(openSidebar()),
  onClose: () => dispatch(closeSidebar())
})

export default connect(mapState, mapDispatch)(Sidebar)
