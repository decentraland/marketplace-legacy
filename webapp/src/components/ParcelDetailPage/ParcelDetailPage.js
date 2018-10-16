import React from 'react'
import PropTypes from 'prop-types'

import Parcel from 'components/Parcel'
import ParcelDetail from './ParcelDetail'
import { publicationType, districtType, mortgageType } from 'components/types'

import './ParcelDetailPage.css'

export default class ParcelDetailPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired,
    publications: PropTypes.objectOf(publicationType),
    districts: PropTypes.objectOf(districtType).isRequired,
    mortgage: mortgageType,
    user: PropTypes.string,
    onBuy: PropTypes.func.isRequired
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
          )}
        </Parcel>
      </div>
    )
  }
}
