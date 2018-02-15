import React from 'react'
import PropTypes from 'prop-types'

import { locations } from 'locations'
import { Container, Header } from 'semantic-ui-react'
import Navbar from 'components/Navbar'
import Loading from 'components/Loading'
import ParcelPreview from 'components/ParcelPreview'
import ParcelDetail from './ParcelDetail'

import { walletType, parcelType, districtType } from 'components/types'

import './ParcelDetailPage.css'

export default class ParcelDetailPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    districts: PropTypes.objectOf(districtType).isRequired,
    isAddressLoading: PropTypes.bool.isRequired,
    isParcelError: PropTypes.bool.isRequired,
    parcel: parcelType,
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired,
    onConnect: PropTypes.func,
    onFetchParcel: PropTypes.func,
    onTransfer: PropTypes.func
  }

  componentWillMount() {
    const { x, y, onConnect, onFetchParcel } = this.props

    onConnect()
    onFetchParcel(x, y)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isParcelError) {
      return this.props.onNavigate(locations.root)
    }
  }

  isLoading() {
    return !this.props.parcel || this.props.isAddressLoading
  }

  handleTransfer = e => {
    const { parcel } = this.props
    this.props.onTransfer(parcel)
  }

  render() {
    const { wallet, parcel, districts, isParcelError } = this.props

    return (
      <div className="ParcelDetailPage">
        <Navbar />

        {isParcelError ? null : this.isLoading() ? (
          <Loading />
        ) : (
          <React.Fragment>
            <div className="parcel-preview">
              <ParcelPreview x={parcel.x} y={parcel.y} />
            </div>
            <Container>
              <ParcelDetail
                wallet={wallet}
                parcel={parcel}
                districts={districts}
                onTransfer={this.handleTransfer}
              />
            </Container>
          </React.Fragment>
        )}
      </div>
    )
  }
}
