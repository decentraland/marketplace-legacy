import React from 'react'
import PropTypes from 'prop-types'
import * as modals from '.'

export default class Modal extends React.Component {
  static propTypes = {
    modal: PropTypes.shape({
      open: PropTypes.bool,
      name: PropTypes.string,
      data: PropTypes.any
    }),
    onClose: PropTypes.func
  }

  handleKeyDown = e => {
    // If ESC key pressed
    if (e.keyCode === 27) {
      const { onClose } = this.props
      onClose()
    }
  }

  handleClose = e => {
    const { onClose } = this.props
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    onClose()
  }

  render() {
    const { modal } = this.props
    const { open, name, data } = modal

    let ModalComponent = modals[name]

    if (!ModalComponent) {
      if (name) {
        console.warn(`Couldn't find a modal named "${name}"`)
      }
      ModalComponent = modals.BaseModal
    }

    return (
      <ModalComponent
        data={data}
        isOpen={open}
        onKeyDown={this.handleKeyDown}
        onClose={this.handleClose}
      />
    )
  }
}
