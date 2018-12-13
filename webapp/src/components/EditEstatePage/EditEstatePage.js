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

  renderEditEstate = (estate, wallet) => {
    const { isSelecting } = this.props
    return (
      <EditEstate
        estate={estate}
        isCreation={isNewEstate(estate)}
        isSelecting={isNewEstate(estate) || isSelecting}
        wallet={wallet}
      />
    )
  }

  render() {
    const { id, x, y } = this.props
    if (!id) {
      return (
        <Parcel x={x} y={y}>
          {(_, { wallet }) =>
            this.renderEditEstate(getInitialEstate(x, y), wallet)
          }
        </Parcel>
      )
    }
    return (
      <Estate id={id}>
        {(estate, { wallet }) => this.renderEditEstate(estate, wallet)}
      </Estate>
    )
  }
}
