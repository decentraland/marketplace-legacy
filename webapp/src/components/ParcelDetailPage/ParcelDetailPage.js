import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import ParcelPreview from 'components/ParcelPreview'
import ParcelDetail from './ParcelDetail'
import Parcel from 'components/Parcel'
import { districtType, publicationType } from 'components/types'
import { locations } from 'locations'
import { t } from 'modules/translation/utils'

import './ParcelDetailPage.css'

export default class ParcelDetailPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    districts: PropTypes.objectOf(districtType).isRequired,
    publications: PropTypes.objectOf(publicationType),
    onFetchParcelPublications: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onBuy: PropTypes.func.isRequired,
    user: PropTypes.string
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
      const { x, y, onFetchParcelPublications } = this.props
      onFetchParcelPublications(x, y)

      this.isAdditionalResourcesFetched = true
    }
  }

  render() {
    const { x, y, error, districts, publications, onBuy, user } = this.props

    if (error) {
      return null
    }
    return (
      <Parcel x={x} y={y}>
        {(parcel, isOwner) => (
          <div className="ParcelDetailPage">
            <Link to={locations.parcelMapDetail(parcel.x, parcel.y, parcel.id)}>
              <div className="parcel-preview" title={t('parcel_detail.view')}>
                <ParcelPreview
                  x={parcel.x}
                  y={parcel.y}
                  size={14}
                  padding={2}
                />
              </div>
            </Link>
            <Container>
              <ParcelDetail
                parcel={parcel}
                isOwner={isOwner}
                districts={districts}
                publications={publications}
                onBuy={onBuy}
                mortgages={parcel.mortgages.filter(
                  mortgage => mortgage.borrower === user
                )}
              />
            </Container>
          </div>
        )}
      </Parcel>
    )
  }
}
