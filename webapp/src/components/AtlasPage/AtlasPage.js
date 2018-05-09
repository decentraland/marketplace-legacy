import React from 'react'

import MapComponent from './Map'
import { walletType } from 'components/types'

import './AtlasPage.css'

export default class AtlasPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType
  }

  render() {
    return (
      <div className="AtlasPage">
        <MapComponent />
      </div>
    )
  }
}
