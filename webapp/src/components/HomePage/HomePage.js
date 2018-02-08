import React from 'react'
import PropTypes from 'prop-types'

import { localStorage } from 'lib/localStorage'

import AccountControls from './AccountControls'
import Sidebar from './Sidebar'
import MapComponent from './Map'
import Minimap from './Minimap'

import './HomePage.css'

export default class HomePage extends React.PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool,
    onConnect: PropTypes.func
  }

  componentWillMount() {
    const { onConnect, onFirstVisit } = this.props

    onConnect()

    if (!localStorage.getItem('seenTermsModal')) {
      onFirstVisit()
    }
  }

  isReady() {
    return !this.props.isLoading
  }

  render() {
    const isReady = this.isReady()

    return (
      <div className="HomePage">
        {isReady && [<AccountControls key="1" />, <Sidebar key="2" />]}
        <MapComponent isReady={isReady} />
        {isReady && <Minimap />}
      </div>
    )
  }
}
