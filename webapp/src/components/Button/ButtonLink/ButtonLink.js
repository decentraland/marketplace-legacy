import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { buildClassName } from '../utils'

export default class ButtonLink extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(['primary', 'secondary', 'default', 'danger']),
    size: PropTypes.oneOf(['small', 'medium', 'big']),
    isSubmit: PropTypes.bool,
    children: PropTypes.node,
    to: PropTypes.string.isRequired
  }
  static defaultProps = {
    className: '',
    type: 'primary',
    isSubmit: false
  }
  render() {
    const { to, className, type, size, children, ...props } = this.props
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
}
