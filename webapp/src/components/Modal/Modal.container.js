import { connect } from 'react-redux'
import { selectors } from 'reducers'
import { closeModal } from 'actions'
import Modal from './Modal'

const mapState = state => {
  return {
    modal: selectors.getModal(state)
  }
}

const mapDispatch = dispatch => ({
  onClose: () => dispatch(closeModal())
})

export default connect(mapState, mapDispatch)(Modal)
