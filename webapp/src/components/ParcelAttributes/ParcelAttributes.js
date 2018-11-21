import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'

import { parcelType } from 'components/types'
import './ParcelAttributes.css'

export default class ParcelAttributes extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    onClick: PropTypes.func,
    onDelete: PropTypes.func
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
    const { onClick, onDelete } = this.props
    const onClickClass = onClick ? 'clickeable' : ''
    const onDeleteClass = onDelete ? 'deleteable' : ''
    return `ParcelAttributes ${onClickClass} ${onDeleteClass}`
  }

  render() {
    const { parcel, onDelete } = this.props

    // We use `className="map alternate"` on Icon because semantic wrongly throws on `name="map marker alternate"` as of 0.78.2
    return (
      <div className={this.getClassName()} onClick={this.handleOnClick}>
        {onDelete ? (
          <div className="delete-button" onClick={this.handleOnDelete}>
            <Icon name="x" />
          </div>
        ) : null}
        <div className="coords">
          <Icon name="marker" className="map alternate" />
          <span className="coord">{parcel.id}</span>
        </div>
      </div>
    )
  }
}
