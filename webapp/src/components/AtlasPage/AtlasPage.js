import React from 'react'

import MapComponent from './Map'

import './AtlasPage.css'

export default class AtlasPage extends React.PureComponent {
  render() {
    return (
      <div className="AtlasPage">
        <MapComponent />
      </div>
    )
  }
}
