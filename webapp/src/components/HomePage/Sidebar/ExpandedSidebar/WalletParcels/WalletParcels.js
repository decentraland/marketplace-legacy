import React from 'react'
import PropTypes from 'prop-types'

import ParcelTable from './ParcelTable'
import Loading from 'components/Loading'

import './WalletParcels.css'

class WalletParcels extends React.PureComponent {
  static propTypes = {
    wallet: PropTypes.object,
    onEdit: PropTypes.func,
    onTransfer: PropTypes.func,
    isLoading: PropTypes.bool,
    hasError: PropTypes.bool
  }

  render() {
    const { wallet, onEdit, onTransfer, isLoading, hasError } = this.props

    if (isLoading) {
      return <Loading />
    }

    if (hasError) {
      return (
        <div className="WalletParcels">
          <p className="error">
            Uh-oh. We couldn’t retrieve your wallet information.
          </p>
        </div>
      )
    }

    return (
      <div className="WalletParcels">
        <div className="heading">
          My LAND&nbsp;
          <span className="parcel-count">
            {wallet.parcels.length} parcel{wallet.parcels.length === 1
              ? ''
              : 's'}
          </span>
        </div>

        <ParcelTable
          parcels={wallet.parcels}
          onEdit={onEdit}
          onTransfer={onTransfer}
        />
      </div>
    )
  }
}

export default WalletParcels
