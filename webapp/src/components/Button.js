import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import './Button.css'

const propTypes = Object.freeze({
  className: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'secondary', 'default', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'big']),
  isSubmit: PropTypes.bool,
  children: PropTypes.node
})

const defaultProps = Object.freeze({
  className: '',
  type: 'primary',
  isSubmit: false
})

export function ButtonLink({ to, className, type, size, children, ...props }) {
  return (
    <Link
      to={{ pathname: to, search: window.location.search }}
      className={buildClassName(className, type, size)}
      {...props}
    >
      {children}
    </Link>
  )
}

ButtonLink.propTypes = {
  ...propTypes,
  to: PropTypes.string.isRequired
}
ButtonLink.defaultProps = defaultProps

export default function Button(props) {
  const { className, type, size, isSubmit, children, ...rest } = props
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

Button.propTypes = propTypes
Button.defaultProps = defaultProps

// -------------------------------------------------------------------------
// Utils

function buildClassName(baseClassName, type, size) {
  let className = `${baseClassName} Button btn btn-${type}`
  if (size) {
    className = `${className} btn-${size}`
  }
  return className
}
