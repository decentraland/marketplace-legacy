import React from 'react'
import PropTypes from 'prop-types'

import { Responsive } from 'semantic-ui-react'
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
        <MapComponent isReady={!isLoading} />
        {!isLoading && (
          <Responsive as={Minimap} minWidth={Responsive.onlyTablet.minWidth} />
        )}
      </div>
    )
  }
}
