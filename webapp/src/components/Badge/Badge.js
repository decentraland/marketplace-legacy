import React from 'react'
import PropTypes from 'prop-types'

import { Label } from 'semantic-ui-react'

export default class Badge extends React.PureComponent {
  static propTypes = {
    size: PropTypes.string,
    text: PropTypes.string,
    color: PropTypes.string,
    children: PropTypes.node
  }

  static defaultProps = {
    size: 'medium',
    color: 'purple'
  }

  render() {
    const { size, text, children, color } = this.props

    return (
      <Label className={`Badge ${color}`} size={size}>
        {text || children}
      </Label>
    )
  }
}
