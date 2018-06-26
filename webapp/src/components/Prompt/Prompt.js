import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import BaseModal from 'components/Modal/BaseModal'

import './Prompt.css'

export default class Prompt extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func
  }

  render() {
    const { title, text, onConfirm, onReject } = this.props
    return (
      <BaseModal
        className="Prompt"
        isOpen
        closeable={false}
        title={title}
        onClose={onReject}
      >
        <div className="modal-body">
          <div className="text">{text}</div>

          <div className="actions">
            {onReject ? <Button onClick={onReject}>Cancel</Button> : null}
            <Button primary onClick={onConfirm}>
              OK
            </Button>
          </div>
        </div>
      </BaseModal>
    )
  }
}
