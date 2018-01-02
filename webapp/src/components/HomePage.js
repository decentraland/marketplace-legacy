import React from 'react'
import PropTypes from 'prop-types'

import SidebarContainer from '../containers/SidebarContainer'
import ParcelsMapContainer from '../containers/ParcelsMapContainer'
// import MinimapContainer from '../containers/MinimapContainer'
import GoogleAnalyticsContainer from '../containers/GoogleAnalyticsContainer'
import ModalContainer from '../containers/modals/ModalContainer'

import './HomePage.css'

export default function HomePage({ isReady }) {
  return (
    <div className="HomePage">
      {isReady && (
        <div className="controls">
          <SidebarContainer />
        </div>
      )}
      <ParcelsMapContainer isReady={isReady} />
      {/*isReady && <MinimapContainer />*/}
      <ModalContainer />
      <GoogleAnalyticsContainer />
    </div>
  )
}

HomePage.propTypes = {
  isReady: PropTypes.bool
}
