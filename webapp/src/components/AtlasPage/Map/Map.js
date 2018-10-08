import React from 'react'
import { isMobile } from 'lib/utils'

import ParcelPreview from 'components/ParcelPreview'

import './Map.css'

export default class MapComponent extends React.Component {
  handleChange = ({ center }) => {
    const { onChange } = this.props
    if (center.x !== this.props.center.x || center.y !== this.props.center.y) {
      onChange(center.x, center.y)
    }
  }

  getSize() {
    return isMobile() ? 7 : 14
  }

  render() {
    const { selected, center, onSelect } = this.props

    return (
      <div className="map-container">
        <ParcelPreview
          x={center.x}
          y={center.y}
          selected={selected}
          isDraggable
          showMinimap
          showPopup
          showControls
          useCache={false}
          size={this.getSize()}
          onClick={onSelect}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}
