import React from 'react'
import PropTypes from 'prop-types'

import { localStorage } from 'lib/localStorage'

import Navbar from 'components/Navbar'
import MapComponent from './Map'
import Minimap from './Minimap'
import { walletType } from 'components/types'

import './AtlasPage.css'

export default class AtlasPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
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
    const { isLoading, wallet } = this.props
    return !isLoading && !!wallet.address
  }

  render() {
    const isReady = this.isReady()
    return (
      <div className="AtlasPage">
        <Navbar />
        <MapComponent isReady={isReady} />
        {isReady && <Minimap />}
      </div>
    )
  }
}
