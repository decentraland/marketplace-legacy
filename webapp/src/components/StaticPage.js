import React from 'react'
import PropTypes from 'prop-types'

import Navbar from './Navbar'

import './StaticPage.css'

export default function StaticPage({ className, children }) {
  return (
    <div className={`StaticPage ${className}`}>
      <Navbar />

      <div className="content">
        <div>{children}</div>
      </div>
    </div>
  )
}

StaticPage.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
}

StaticPage.defaultProps = {
  className: ''
}
