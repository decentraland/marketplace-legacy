import React from 'react'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import Navbar from 'components/StaticPage'
import Loading from 'components/Loading'
import { getParcelAttributes } from 'lib/parcelUtils'

import './ParcelDetailPage.css'

export default class ParcelDetailPage extends React.PureComponent {
  static propTypes = {}

  componentWillMount() {
    const { x, y, onConnect, onFetchParcel } = this.props

    onConnect()
    onFetchParcel(x, y)
  }

  isLoading() {
    return !this.props.parcel || this.props.isAddressLoading
  }

  render() {
    const { wallet, parcel, districts, isParcelError } = this.props

    return (
      <div className="ParcelDetailPage">
        <Navbar />

        {isParcelError ? (
          <div>ERROR PAGE</div>
        ) : this.isLoading() ? (
          <Loading />
        ) : (
          <ParcelDetail wallet={wallet} parcel={parcel} districts={districts} />
        )}
      </div>
    )
  }
}

class ParcelDetail extends React.PureComponent {
  render() {
    const { wallet, parcel, districts } = this.props
    const { x, y } = parcel

    const coordinate = `${x}, ${y}`
    const { backgroundColor, label } = getParcelAttributes(
      wallet,
      parcel,
      districts
    )

    return (
      <div className="ParcelDetail container">
        <h2 className="title">Parcel Detail</h2>

        <div className="row">
          <div className="col-xs-12">
            <h3 className="parcel-name">
              {parcel.name
                ? [
                    parcel.name,
                    <span key="1" className="parcel-name-secondary">
                      &nbsp;{coordinate}
                    </span>
                  ]
                : [
                    coordinate,
                    <span key="1" className="parcel-name-secondary">
                      &nbsp;Untitled Parcel
                    </span>
                  ]}
            </h3>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <div className="owned-by">
              Owned by <Link to={locations.parcelMapDetail(x, y)}>{label}</Link>&nbsp;
              <div className="square" style={{ backgroundColor }} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <p className="parcel-description">
              {parcel.description || 'This parcel has no description'}
            </p>
          </div>
        </div>
      </div>
    )
  }
}
