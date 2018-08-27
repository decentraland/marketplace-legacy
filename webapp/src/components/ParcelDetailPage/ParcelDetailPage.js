import React from 'react'
import PropTypes from 'prop-types'

import { isFeatureEnabled } from 'lib/featureUtils'
import AssetDetailPage from 'components/AssetDetailPage'
import Parcel from 'components/Parcel'
import ParcelDetail from './ParcelDetail'
import { publicationType, districtType, mortgageType } from 'components/types'

import './ParcelDetailPage.css'

export default class ParcelDetailPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired,
    publications: PropTypes.objectOf(publicationType).isRequired,
    districts: PropTypes.objectOf(districtType).isRequired,
    mortgage: mortgageType,
    user: PropTypes.string,
    onFetchParcelPublications: PropTypes.func.isRequired,
    onFetchActiveParcelMortgages: PropTypes.func.isRequired,
    onBuy: PropTypes.func.isRequired,
    onAssetClick: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.isAdditionalResourcesFetched = false
  }

  componentWillReceiveProps(nextProps) {
    const { x, y } = this.props
    const hasChangedParcel = nextProps.x !== x || nextProps.y !== y

    if (hasChangedParcel) {
      this.isAdditionalResourcesFetched = false
    }

    if (!nextProps.isLoading || hasChangedParcel) {
      this.fetchAdditionalParcelResources(nextProps.x, nextProps.y)
    }
  }

  fetchAdditionalParcelResources(x, y) {
    if (!this.isAdditionalResourcesFetched) {
      const {
        onFetchParcelPublications,
        onFetchActiveParcelMortgages
      } = this.props

      if (isFeatureEnabled('MORTGAGES')) {
        onFetchActiveParcelMortgages(x, y)
      }
      onFetchParcelPublications(x, y)

      this.isAdditionalResourcesFetched = true
    }
  }

  render() {
    const {
      x,
      y,
      publications,
      districts,
      estates,
      mortgage,
      onBuy
    } = this.props

    return (
      <div className="ParcelDetailPage">
        <Parcel x={x} y={y}>
          {(parcel, isOwner, wallet) => (
            <AssetDetailPage asset={parcel} {...this.props}>
              <ParcelDetail
                wallet={wallet}
                parcel={parcel}
                isOwner={isOwner}
                publications={publications}
                districts={districts}
                estates={estates}
                onBuy={onBuy}
                mortgage={mortgage}
              />
            </AssetDetailPage>
          )}
        </Parcel>
      </div>
    )
  }
}
