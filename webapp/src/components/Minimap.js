import React from 'react'

import { getBounds } from '../lib/parcelUtils'

import './Minimap.css'

const MINIMAP_SIZE = 150 /* pixels */
const bounds = getBounds()
const PARCELS = bounds.maxX - bounds.minX
const scale = MINIMAP_SIZE / PARCELS

const baseY = Math.abs(bounds.minY)
const baseX = Math.abs(bounds.minX)

export default class Minimap extends React.Component {
  constructor(props, ...args) {
    super(props, ...args)
    this.state = {
      minX: props.minX,
      maxX: props.maxX,
      minY: props.minY,
      maxY: props.maxY
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      minX: newProps.minX,
      maxX: newProps.maxX,
      minY: newProps.minY,
      maxY: newProps.maxY,
      down: false
    })
  }

  boundCoord(coord, offsetMax = 0, offsetMin = 0) {
    return Math.min(150 - offsetMax, Math.max(coord, -150 + offsetMin))
  }

  updateWithDeltaMouseCoords(x, y, otherUpdates) {
    x /= scale
    y /= scale
    const minX = this.boundCoord(
      this.props.minX + x,
      this.props.maxX - this.props.minX
    )
    const maxX = this.boundCoord(this.props.maxX + x)
    const minY = this.boundCoord(
      this.props.minY - y,
      0,
      this.props.maxY - this.props.minY
    )
    const maxY = this.boundCoord(this.props.maxY - y)
    this.setState({
      ...otherUpdates,
      minX,
      maxX,
      minY,
      maxY
    })
  }

  get currentX() {
    const bound = this.map.getBoundingClientRect()
    return bound.left + (this.props.minX + this.halfWidth + baseX) * scale
  }

  get currentY() {
    const bound = this.map.getBoundingClientRect()
    return bound.top - (this.props.maxY - this.halfHeight - baseY) * scale
  }

  newCenter(deltaX, deltaY) {
    deltaX /= scale
    deltaY /= scale
    const x = this.boundCoord(this.averageX + deltaX)
    const y = this.boundCoord(this.averageY - deltaY)
    return { x: Math.floor(x), y: Math.floor(y) }
  }

  submitChange(deltaX, deltaY, otherState) {
    const { x, y } = this.newCenter(deltaX, deltaY)
    this.props.update(x, y)
    this.updateWithDeltaMouseCoords(deltaX, deltaY, { down: false })
  }

  mouseDown = ev => {
    const deltaX = ev.clientX - this.currentX
    const deltaY = ev.clientY - this.currentY
    this.updateWithDeltaMouseCoords(deltaX, deltaY, { down: true })
  }

  mouseUp = ev => {
    if (this.state.down) {
      const deltaX = ev.clientX - this.currentX
      const deltaY = ev.clientY - this.currentY
      this.submitChange(deltaX, deltaY)
    }
  }

  mouseMove = ev => {
    if (this.state.down) {
      const deltaX = ev.clientX - this.currentX
      const deltaY = ev.clientY - this.currentY
      this.updateWithDeltaMouseCoords(deltaX, deltaY)
    }
  }

  mouseOut = ev => {
    if (ev.target === window) {
      if (this.state.down) {
        const deltaX = ev.clientX - this.currentX
        const deltaY = ev.clientY - this.currentY
        this.submitChange(deltaX, deltaY)
      }
    }
  }

  componentWillMount() {
    window.addEventListener('mousemove', this.mouseMove)
    window.addEventListener('mouseup', this.mouseUp)
    window.addEventListener('mouseout', this.mouseOut)
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.mouseMove)
    window.removeEventListener('mouseup', this.mouseUp)
    window.removeEventListener('mouseout', this.mouseOut)
  }

  get halfHeight() {
    return Math.floor(this.height / 2)
  }

  get halfWidth() {
    return Math.floor(this.width / 2)
  }

  get averageX() {
    return Math.round((this.props.minX + this.props.maxX) / 2)
  }

  get averageY() {
    return Math.round((this.props.minY + this.props.maxY) / 2)
  }

  get height() {
    const { minY, maxY } = this.props
    return maxY - minY
  }

  get width() {
    const { minX, maxX } = this.props
    return maxX - minX
  }

  render() {
    const { maxY, minX } = this.state
    const top = MINIMAP_SIZE - (maxY + baseY) * scale
    const left = (minX + baseX) * scale

    return (
      <div
        className="Minimap"
        ref={map => (this.map = map)}
        onMouseDown={this.mouseDown}
      >
        <div
          className="minimap-focus"
          style={{
            top,
            left,
            width: this.width * scale,
            height: this.height * scale
          }}
        />
      </div>
    )
  }
}
