import React from 'react'
import PropTypes from 'prop-types'

import * as modals from '.'
import { preventDefault } from 'lib/utils'

export default class Modal extends React.PureComponent {
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
    this.props.onClose()
  }

  render() {
    const { modal, location } = this.props
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
        onClose={preventDefault(this.handleClose)}
        location={location}
      />
    )
  }
}
