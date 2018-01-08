import React from 'react'
import PropTypes from 'prop-types'

import SidebarContainer from 'containers/SidebarContainer'
import ParcelsMapContainer from 'containers/ParcelsMapContainer'
// import MinimapContainer from '../containers/MinimapContainer'
import GoogleAnalyticsContainer from 'containers/GoogleAnalyticsContainer'
import ModalContainer from 'containers/modals/ModalContainer'

import './HomePage.css'

export default class HomePage extends React.PureComponent {
  static propTypes = {
    isReady: PropTypes.bool
  }

  render() {
    const { isReady } = this.props

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
}
