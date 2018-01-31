import React from 'react'
import PropTypes from 'prop-types'

import { localStorage } from 'lib/localStorage'

import Sidebar from './Sidebar'
import MapComponent from './Map'
import Minimap from './Minimap'
import Modal from 'components/Modal'
import Toast from 'components/Toast'

import './HomePage.css'

export default class HomePage extends React.PureComponent {
  static propTypes = {
    isReady: PropTypes.bool,
    onConnect: PropTypes.func
  }

  componentWillMount() {
    const { onConnect, onFirstVisit } = this.props

    onConnect()

    if (!localStorage.getItem('seenTermsModal')) {
      onFirstVisit()
    }
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
        {isReady && <Minimap />}
        <Modal />
        <Toast />
      </div>
    )
  }
}
