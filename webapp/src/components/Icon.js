import React from 'react'
import PropTypes from 'prop-types'

import './Icon.css'

export default function Icon({ name, className }) {
  className += ' Icon'

  if (name) {
    className += ` Icon-${name}`
  }

  return <i className={className} />
}

Icon.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string
}

Icon.defaultProps = {
  className: ''
}
