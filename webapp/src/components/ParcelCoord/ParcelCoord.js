import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'

import { parcelType } from 'components/types'
import './ParcelCoord.css'

export default class ParcelCoord extends React.PureComponent {
  static propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    parcel: parcelType,
    status: PropTypes.string,
    onClick: PropTypes.func,
    onDelete: PropTypes.func
  }

  static defaultProps = {
    size: 'medium',
    status: ''
  }

  handleOnClick = () => {
    const { onClick, parcel } = this.props
    if (onClick) {
      onClick(parcel)
    }
  }

  handleOnDelete = event => {
    const { onDelete, parcel } = this.props
    onDelete(parcel)
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
  }

  getClassName() {
    const { size, status, onClick, onDelete } = this.props
    const statusClass = status
      ? `has-status status-${status.toLowerCase()}`
      : ''
    const onClickClass = onClick ? 'clickeable' : ''
    const onDeleteClass = onDelete ? 'deleteable' : ''
    return `ParcelCoord ${size} ${statusClass} ${onClickClass} ${onDeleteClass}`
  }

  render() {
    const { parcel, status, onDelete } = this.props

    // We use `className="map alternate"` on Icon because semantic wrongly throws on `name="map marker alternate"` as of 0.78.2
    return (
      <div className={this.getClassName()} onClick={this.handleOnClick}>
        {onDelete ? (
          <div className="delete-button" onClick={this.handleOnDelete}>
            <Icon name="x" />
          </div>
        ) : null}
        <div className="attribute coords">
          <Icon name="marker" className="map alternate" />
          <span className="coord">{parcel.id}</span>
        </div>
        {status ? (
          <span className="attribute status">{status.toUpperCase()}</span>
        ) : null}
      </div>
    )
  }
}
