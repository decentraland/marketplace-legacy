import { connect } from 'react-redux'

import { getToasts } from 'modules/ui/reducer'
import { closeToast } from 'modules/ui/actions'

import { Toast as ToastComponent } from './Toast'

const mapState = state => {
  return {
    toasts: getToasts(state)
  }
}

const mapDispatch = dispatch => ({
  onClose: id => dispatch(closeToast(id))
})

export const Toast = connect(mapState, mapDispatch)(ToastComponent)
