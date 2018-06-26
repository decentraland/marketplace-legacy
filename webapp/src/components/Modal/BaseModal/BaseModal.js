import React from 'react'
import PropTypes from 'prop-types'

import './BaseModal.css'

export default function BaseModal(props) {
  const {
    className,
    title,
    isOpen,
    body,
    footer,
    children,
    onClose,
    onKeyDown,
    closeable
  } = props

  const containerClassName = `${className} ${isOpen ? 'modal-open' : ''}`
  const modalClassName = `modal fade ${isOpen ? 'in' : ''}`

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
              <ModalCloseButton onClose={onClose} closeable={closeable}>
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
      {isOpen && <div className="modal-backdrop fade in" />}
    </div>
  )
}

BaseModal.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  body: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  closeable: PropTypes.bool
}

BaseModal.defaultProps = {
  className: '',
  isOpen: false,
  closeable: true
}

export function ModalCloseButton({ onClose, children, closeable }) {
  return closeable ? (
    <button
      type="button"
      className="close"
      data-dismiss="modal"
      onClick={onClose}
    >
      {children}
    </button>
  ) : null
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
