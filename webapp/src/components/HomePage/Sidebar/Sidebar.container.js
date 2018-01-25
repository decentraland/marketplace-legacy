import { connect } from 'react-redux'
import { getWallet } from 'modules/wallet/reducer'
import { isLoading } from 'modules/ui/loading/reducer'
import { isLoading as isLoadingParcels } from 'modules/parcels/reducer'
import { isOpen } from 'modules/ui/sidebar/reducer'
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
