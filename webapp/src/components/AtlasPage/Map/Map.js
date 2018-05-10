import React from 'react'
import { Loader } from 'semantic-ui-react'
import { isMobile } from 'lib/utils'

import ParcelPreview from 'components/ParcelPreview'

import './Map.css'

export default class MapComponent extends React.Component {
  handleChange = ({ center }) => {
    const { onChange, selected } = this.props
    if (center.x !== this.props.center.x || center.y !== this.props.center.y) {
      onChange(center.x, center.y, selected ? selected.id : null)
    }
  }

  getSize() {
    return isMobile() ? 7 : 14
  }

  render() {
    const { selected, center, onSelect, isLoading } = this.props
    return isLoading ? (
      <Loader active size="massive" />
    ) : (
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
