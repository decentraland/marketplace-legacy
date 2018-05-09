import React from 'react'
import { Icon } from 'semantic-ui-react'
import './Controls.css'

export default class Controls extends React.PureComponent {
  render() {
    const {
      target,
      center,
      size,
      minSize,
      maxSize,
      onTarget,
      onZoomIn,
      onZoomOut
    } = this.props

    const isTargetVisible = !!target
    const isTargetDisabled =
      target && center.x === target.x && center.y === target.y

    const isZoomInDisabled = size === maxSize
    const isZoomOutDisabled = size === minSize

    return (
      <div className="MapControls">
        {isTargetVisible ? (
          <div
            className={'control-button' + (isTargetDisabled ? ' disabled' : '')}
            onClick={isTargetDisabled ? undefined : onTarget}
          >
            <Icon name="crosshairs" />
          </div>
        ) : null}
        <div className="control-button-group">
          <div
            className={'control-button' + (isZoomInDisabled ? ' disabled' : '')}
            onClick={isZoomInDisabled ? undefined : onZoomIn}
          >
            <Icon name="plus" />
          </div>
          <div
            className={
              'control-button' + (isZoomOutDisabled ? ' disabled' : '')
            }
            onClick={isZoomOutDisabled ? undefined : onZoomOut}
          >
            <Icon name="minus" />
          </div>
        </div>
      </div>
    )
  }
}
