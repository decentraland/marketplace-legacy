import React from 'react'
import PropTypes from 'prop-types'

import { toastType } from 'components/types'
import { preventDefault } from 'lib/utils'

import './Toast.css'

export default class Toast extends React.PureComponent {
  static propTypes = {
    toasts: PropTypes.objectOf(toastType),
    onClose: PropTypes.func
  }

  render() {
    const { toasts, onClose } = this.props
    const toastList = Object.values(toasts)

    return (
      <div className="toasts-container">
        {toastList.map((toast, index) => (
          <ToastMessage key={index} onClose={onClose} {...toast} />
        ))}
      </div>
    )
  }
}

class ToastMessage extends React.PureComponent {
  static defaultProps = {
    kind: 'info',
    message: '',
    delay: 3500
  }

  componentDidMount() {
    window.setTimeout(this.handleClose, this.props.delay)
  }

  handleClose = e => {
    const { id, onClose } = this.props
    onClose(id)
  }

  render() {
    const { kind, message } = this.props

    return (
      <div className={`toast toast-${kind}`}>
        <div className="close" onClick={preventDefault(this.handleClose)}>
          <span aria-hidden="true">&times;</span>
        </div>

        {message}
      </div>
    )
  }
}
