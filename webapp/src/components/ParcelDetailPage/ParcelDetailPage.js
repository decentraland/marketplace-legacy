import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'semantic-ui-react'
import ParcelPreview from 'components/ParcelPreview'
import ParcelDetail from './ParcelDetail'
import Parcel from 'components/Parcel'
import { districtType, publicationType } from 'components/types'

import './ParcelDetailPage.css'

export default class ParcelDetailPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    districts: PropTypes.objectOf(districtType).isRequired,
    publications: PropTypes.objectOf(publicationType),
    mortgages: PropTypes.array,
    onFetchParcelPublications: PropTypes.func.isRequired,
    onFetchActiveParcelMortgages: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onBuy: PropTypes.func.isRequired,
    user: PropTypes.string,
    onParcelClick: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.isAdditionalResourcesFetched = false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      return this.props.onError(nextProps.error)
    }

    if (!nextProps.isLoading) {
      this.fetchAdditionalParcelResources()
    }
  }

  fetchAdditionalParcelResources() {
    if (!this.isAdditionalResourcesFetched) {
      const {
        x,
        y,
        onFetchParcelPublications,
        onFetchActiveParcelMortgages
      } = this.props

      onFetchActiveParcelMortgages(x, y)
      onFetchParcelPublications(x, y)

      this.isAdditionalResourcesFetched = true
    }
  }

  render() {
    const {
      x,
      y,
      error,
      districts,
      publications,
      onBuy,
      onParcelClick,
      mortgages
    } = this.props

    if (error) {
      return null
    }
    return (
      <Parcel x={x} y={y}>
        {(parcel, isOwner) => (
          <div className="ParcelDetailPage">
            <div className="parcel-preview">
              <ParcelPreview
                x={parcel.x}
                y={parcel.y}
                selected={parcel}
                isDraggable
                showMinimap
                showPopup
                showControls
                onClick={onParcelClick}
              />
            </div>
            <Container>
              <ParcelDetail
                parcel={parcel}
                isOwner={isOwner}
                districts={districts}
                publications={publications}
                onBuy={onBuy}
                mortgages={mortgages}
              />
            </Container>
          </div>
        )}
      </Parcel>
    )
  }
}
