import React from 'react'
import PropTypes from 'prop-types'

import { locations } from 'locations'
import { Container, Loader } from 'semantic-ui-react'
import Navbar from 'components/Navbar'
import ParcelPreview from 'components/ParcelPreview'
import ParcelDetail from './ParcelDetail'

import { walletType, parcelType, districtType } from 'components/types'

import './ParcelDetailPage.css'

export default class ParcelDetailPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    districts: PropTypes.objectOf(districtType),
    isLoading: PropTypes.bool.isRequired,
    hasError: PropTypes.bool.isRequired,
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
    if (nextProps.hasError) {
      return this.props.onNavigate(locations.root)
    }
  }

  isLoading() {
    return !this.props.parcel || this.props.isLoading
  }

  render() {
    const { parcel, hasError, isOwner } = this.props

    return (
      <div className="ParcelDetailPage">
        <Navbar />

        {hasError ? null : this.isLoading() ? (
          <Loader size="massive" />
        ) : (
          <React.Fragment>
            <div className="parcel-preview">
              <ParcelPreview x={parcel.x} y={parcel.y} />
            </div>
            <Container>
              <ParcelDetail parcel={parcel} isOwner={isOwner} />
            </Container>
          </React.Fragment>
        )}
      </div>
    )
  }
}
