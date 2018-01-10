import React from 'react'
import PropTypes from 'prop-types'

import ParcelTable from './ParcelTable'
import Loading from 'components/Loading'

import './WalletParcels.css'

class WalletParcels extends React.PureComponent {
  static propTypes = {
    wallet: PropTypes.object,
    onEdit: PropTypes.func,
    isLoading: PropTypes.bool,
    hasError: PropTypes.bool
  }

  render() {
    const { wallet, onEdit, isLoading, hasError } = this.props

    if (isLoading) {
      return <Loading />
    }

    if (hasError) {
      return <p>Error</p>
    }

    return (
      <div className="WalletParcels">
        <div className="heading">
          My Land&nbsp;
          <span className="parcel-count">{wallet.parcels.length} parcels</span>
        </div>

        <ParcelTable parcels={wallet.parcels} onEdit={onEdit} />
      </div>
    )
  }
}

export default WalletParcels
