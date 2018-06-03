import React from 'react'
import { Icon } from 'semantic-ui-react'
import { isEqual } from 'lib/utils'

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
    const isTargetDisabled = target && isEqual(center, target)

    const isZoomInDisabled = size === maxSize
    const isZoomOutDisabled = size === minSize

    return (
      <div className="MapControls">
        {isTargetVisible ? (
          <div
            className={'control-button' + (isTargetDisabled ? ' disabled' : '')}
            onClick={isTargetDisabled ? null : onTarget}
          >
            <Icon name="crosshairs" />
          </div>
        ) : null}
        <div className="control-button-group">
          <div
            className={'control-button' + (isZoomInDisabled ? ' disabled' : '')}
            onClick={isZoomInDisabled ? null : onZoomIn}
          >
            <Icon name="plus" />
          </div>
          <div
            className={
              'control-button' + (isZoomOutDisabled ? ' disabled' : '')
            }
            onClick={isZoomOutDisabled ? null : onZoomOut}
          >
            <Icon name="minus" />
          </div>
        </div>
      </div>
    )
  }
}
