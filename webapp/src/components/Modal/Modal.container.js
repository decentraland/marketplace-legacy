import { connect } from 'react-redux'
import { getModal } from 'modules/ui/selectors'
import { closeModal } from 'modules/ui/actions'
import Modal from './Modal'

const mapState = state => {
  return {
    modal: getModal(state)
  }
}

const mapDispatch = dispatch => ({
  onClose: () => dispatch(closeModal())
})

export default connect(mapState, mapDispatch)(Modal)
