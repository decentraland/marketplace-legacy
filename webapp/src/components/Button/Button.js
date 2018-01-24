import React from 'react'
import PropTypes from 'prop-types'
import { buildClassName } from './utils'

import './Button.css'

export default class Button extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(['primary', 'secondary', 'default', 'danger']),
    size: PropTypes.oneOf(['small', 'medium', 'big']),
    isSubmit: PropTypes.bool,
    children: PropTypes.node
  }

  static defaultProps = {
    className: '',
    type: 'primary',
    isSubmit: false
  }

  render() {
    const { className, type, size, isSubmit, children, ...rest } = this.props
    const buttonType = isSubmit ? 'submit' : 'button'

    return (
      <button
        type={buttonType}
        className={buildClassName(className, type, size)}
        {...rest}
      >
        {children}
      </button>
    )
  }
}
