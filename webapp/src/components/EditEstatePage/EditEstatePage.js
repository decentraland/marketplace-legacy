import React from 'react'
import PropTypes from 'prop-types'

import Estate from 'components/Estate'
import { isNewEstate } from 'shared/estate'
import EditEstate from './EditEstate'
import Parcel from 'components/Parcel'
import { getInitialEstate } from 'shared/estate'

export default class EditEstatePage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    isSelecting: PropTypes.bool
  }

  renderEditEstate = (estate, isOwner, wallet) => {
    const { isSelecting } = this.props
    return (
      <EditEstate
        estate={estate}
        isCreation={isNewEstate(estate)}
        isSelecting={isNewEstate(estate) || isSelecting}
        isOwner={isOwner}
        wallet={wallet}
      />
    )
  }

  render() {
    const { id, x, y } = this.props
    if (!id) {
      return (
        <Parcel x={x} y={y}>
          {(_, isOwner, wallet) =>
            this.renderEditEstate(getInitialEstate(x, y), isOwner, wallet)
          }
        </Parcel>
      )
    }
    return <Estate id={id}>{this.renderEditEstate}</Estate>
  }
}
