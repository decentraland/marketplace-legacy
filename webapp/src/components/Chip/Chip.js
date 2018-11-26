import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'

import './Chip.css'

export default class Chip extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    status: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func,
    onDelete: PropTypes.func
  }

  static defaultProps = {
    className: '',
    size: 'medium',
    status: ''
  }

  handleOnClick = () => {
    const { onClick } = this.props
    if (onClick) onClick()
  }

  handleOnDelete = event => {
    const { onDelete } = this.props
    if (onDelete) {
      onDelete()
      event.stopPropagation()
      event.nativeEvent.stopImmediatePropagation()
    }
  }

  getClassName() {
    const { className, size, status, onClick, onDelete } = this.props
    const statusClass = status
      ? `has-status status-${status.toLowerCase()}`
      : ''
    const onClickClass = onClick ? 'clickeable' : ''
    const onDeleteClass = onDelete ? 'deleteable' : ''
    return `Chip ${className} ${size} ${statusClass} ${onClickClass} ${onDeleteClass}`
  }

  render() {
    const { children, status, onDelete } = this.props

    return (
      <div className={this.getClassName()} onClick={this.handleOnClick}>
        {onDelete ? (
          <div className="delete-button" onClick={this.handleOnDelete}>
            <Icon name="x" />
          </div>
        ) : null}
        <div className="attribute content">{children}</div>
        {status ? (
          <span className="attribute status">{status.toUpperCase()}</span>
        ) : null}
      </div>
    )
  }
}
