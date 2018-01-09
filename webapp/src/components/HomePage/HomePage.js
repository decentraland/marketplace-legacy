import React from 'react'
import PropTypes from 'prop-types'

import Sidebar from './Sidebar'
import MapComponent from './Map'
// import MinimapContainer from './Minimap'
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
            <Sidebar />
          </div>
        )}
        <MapComponent isReady={isReady} />
        {/*isReady && <MinimapContainer />*/}
        <ModalContainer />
      </div>
    )
  }
}
