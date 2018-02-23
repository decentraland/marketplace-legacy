import React from 'react'
import PropTypes from 'prop-types'

import { localStorage } from 'lib/localStorage'

import AddressLink from 'components/AddressLink'
import Sidebar from './Sidebar'
import MapComponent from './Map'
import Minimap from './Minimap'
import { walletType } from 'components/types'
import { locations } from 'locations'

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

    const { wallet } = this.props

    return (
      <div className="AtlasPage">
        {isReady && [
          <AddressLink
            key="1"
            address={wallet.address}
            className="settings"
            link={locations.settings}
          />,
          <Sidebar key="2" />
        ]}
        <MapComponent isReady={isReady} />
        {isReady && <Minimap />}
      </div>
    )
  }
}
