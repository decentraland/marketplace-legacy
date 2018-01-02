import React from 'react'
import PropTypes from 'prop-types'

import './Modal.css'

export default function Modal(props) {
  const {
    className,
    title,
    visible,
    body,
    footer,
    children,
    onClose,
    onKeyDown
  } = props

  const containerClassName = `${className} ${visible ? 'modal-open' : ''}`
  const modalClassName = `modal fade ${visible ? 'in' : ''}`

  return (
    <div className={containerClassName}>
      <div
        className={modalClassName}
        tabIndex="-1"
        role="dialog"
        onKeyDown={onKeyDown}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <ModalCloseButton onClose={onClose}>
                <span aria-hidden="true">&times;</span>
              </ModalCloseButton>
              {title && <ModalTitle title={title} />}
            </div>
            {body && <ModalBody body={body} />}
            {footer && <ModalFooter footer={footer} />}
            {children}
          </div>
        </div>
      </div>
      {visible && <div className="modal-backdrop fade in" />}
    </div>
  )
}

Modal.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  body: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired
}

Modal.defaultProps = {
  className: '',
  visible: false
}

export function ModalCloseButton({ onClose, children }) {
  return (
    <button
      type="button"
      className="close btn btn-secondary"
      data-dismiss="modal"
      onClick={onClose}
    >
      {children}
    </button>
  )
}

export function ModalTitle({ title }) {
  return <h4 className="modal-title">{title}</h4>
}

export function ModalBody({ body }) {
  return <div className="modal-body">{body}</div>
}

export function ModalFooter({ footer }) {
  return <div className="modal-footer">{footer}</div>
}
