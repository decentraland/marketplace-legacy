import React from 'react'
import PropTypes from 'prop-types'

import './BaseModal.css'

export default class BaseModal extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    body: PropTypes.node,
    footer: PropTypes.node,
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
    isCloseable: PropTypes.bool
  }

  static defaultProps = {
    className: '',
    isOpen: false,
    isCloseable: true
  }

  getContainerClassName() {
    const { className, isOpen } = this.props
    return `${className} ${isOpen ? 'modal-open' : ''}`
  }

  getModalClassName() {
    const { isOpen } = this.props
    return `modal fade ${isOpen ? 'in' : ''}`
  }

  render() {
    const {
      title,
      isOpen,
      body,
      footer,
      children,
      onClose,
      onKeyDown,
      isCloseable
    } = this.props

    return (
      <div className={this.getContainerClassName()}>
        <div
          className={this.getModalClassName()}
          tabIndex="-1"
          role="dialog"
          onKeyDown={onKeyDown}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                {isCloseable ? (
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    onClick={onClose}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                ) : null}
                {title && <h4 className="modal-title">{title}</h4>}
              </div>
              {body && <div className="modal-body">{body}</div>}
              {footer && <div className="modal-footer">{footer}</div>}
              {children}
            </div>
          </div>
        </div>
        {isOpen && <div className="modal-backdrop fade in" />}
      </div>
    )
  }
}
