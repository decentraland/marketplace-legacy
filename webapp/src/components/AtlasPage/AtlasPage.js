import React from 'react'
import PropTypes from 'prop-types'

import Navbar from 'components/Navbar'
import MapComponent from './Map'
import Minimap from './Minimap'
import { walletType } from 'components/types'

import './AtlasPage.css'

export default class AtlasPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    isLoading: PropTypes.bool
  }

  render() {
    const { isLoading } = this.props
    return (
      <div className="AtlasPage">
        <Navbar />
        <MapComponent isReady={!isLoading} />
        {!isLoading && <Minimap />}
      </div>
    )
  }
}
