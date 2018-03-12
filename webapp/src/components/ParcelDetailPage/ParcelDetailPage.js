import React from 'react'
import PropTypes from 'prop-types'

import { Container } from 'semantic-ui-react'
import ParcelPreview from 'components/ParcelPreview'
import ParcelDetail from './ParcelDetail'
import Parcel from 'components/Parcel'
import { districtType } from 'components/types'

import './ParcelDetailPage.css'

export default class ParcelDetailPage extends React.PureComponent {
  static propTypes = {
    error: PropTypes.string,
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired,
    districts: PropTypes.objectOf(districtType).isRequired,
    onError: PropTypes.func.isRequired,
    onBuy: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      return this.props.onError(nextProps.error)
    }
  }

  render() {
    const { x, y, error, districts, publications, onBuy } = this.props
    if (error) {
      return null
    }
    return (
      <Parcel x={x} y={y}>
        {(parcel, isOwner) => (
          <div className="ParcelDetailPage">
            <div className="parcel-preview">
              <ParcelPreview x={parcel.x} y={parcel.y} />
            </div>
            <Container>
              <ParcelDetail
                parcel={parcel}
                isOwner={isOwner}
                districts={districts}
                publications={publications}
                onBuy={onBuy}
              />
            </Container>
          </div>
        )}
      </Parcel>
    )
  }
}
