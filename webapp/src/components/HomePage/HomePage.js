import React from 'react'
import PropTypes from 'prop-types'

import SidebarContainer from 'containers/SidebarContainer'
import MapComponent from './Map'
// import MinimapContainer from './Minimap'
import GoogleAnalytics from './GoogleAnalytics'
import ModalContainer from 'containers/modals/ModalContainer'

import './HomePage.css'

export default class HomePage extends React.PureComponent {
  static propTypes = {
    isReady: PropTypes.bool,
    onConnect: PropTypes.func
  }

  componentWillMount() {
    const { onConnect } = this.props
    onConnect()
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
        <MapComponent isReady={isReady} />
        {/*isReady && <MinimapContainer />*/}
        <ModalContainer />
        <GoogleAnalytics />
      </div>
    )
  }
}
