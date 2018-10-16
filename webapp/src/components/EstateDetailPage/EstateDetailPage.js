import React from 'react'
import PropTypes from 'prop-types'

import Estate from 'components/Estate'
import { parcelType, publicationType } from 'components/types'
import EstateDetail from 'components/EstateDetailPage/EstateDetail'

export default class EstateDetailPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    id: PropTypes.string,
    publications: PropTypes.objectOf(publicationType).isRequired,
    allParcels: PropTypes.objectOf(parcelType),
    onEditParcels: PropTypes.func.isRequired,
    onEditMetadata: PropTypes.func.isRequired,
    onManageEstate: PropTypes.func.isRequired
  }

  render() {
    const {
      id,
      publications,
      allParcels,
      onEditParcels,
      onEditMetadata,
      onManageEstate
    } = this.props
    return (
      <Estate id={id}>
        {(estate, isOwner) => (
          <EstateDetail
            estate={estate}
            publications={publications}
            allParcels={allParcels}
            isOwner={isOwner}
            onEditParcels={onEditParcels}
            onEditMetadata={onEditMetadata}
            onManageEstate={onManageEstate}
          />
        )}
      </Estate>
    )
  }
}
