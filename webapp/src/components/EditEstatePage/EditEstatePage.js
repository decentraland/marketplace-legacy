import React from 'react'
import PropTypes from 'prop-types'

import { isNewEstate } from 'shared/estate'
import { getInitialEstate } from 'shared/estate'
import { ACTIONS } from 'shared/roles'
import Estate from 'components/Estate'
import Parcel from 'components/Parcel'
import EditEstateMetadata from 'components/EditEstateMetadataPage/EditEstateMetadata'
import { walletType } from 'components/types'
import SelectEstateParcels from './SelectEstateParcels'

export default class EditEstatePage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    wallet: walletType
  }

  constructor(props) {
    super(props)
    this.state = {
      isSelectingParcels: true,
      modifiedEstate: undefined
    }
  }

  renderCreateEstate = fetchedEstate => {
    const { isSelectingParcels, modifiedEstate } = this.state
    const estate = modifiedEstate || fetchedEstate

    return isSelectingParcels ? (
      this.renderEditEstateParcels(estate)
    ) : (
      <EditEstateMetadata
        estate={estate}
        onSubmit={this.handleSubmit}
        onCancel={this.handlePageChange}
      />
    )
  }

  renderEditEstateParcels = estate => {
    const { wallet } = this.props
    return (
      <SelectEstateParcels
        pristineEstate={estate}
        wallet={wallet}
        onSubmit={this.handleSelectParcelsSubmit}
        onCancel={this.handleCancel}
      />
    )
  }

  handleSelectParcelsSubmit = estate => {
    const { onEditEstateParcels } = this.props

    if (isNewEstate(estate)) {
      this.handlePageChange()
      this.setState({ modifiedEstate: estate })
    } else {
      onEditEstateParcels(estate)
    }
  }

  handleSubmit = estate => {
    const { isSelectingParcels } = this.state
    const {
      onCreateEstate,
      onEditEstateParcels,
      onEditEstateMetadata
    } = this.props
    const isNew = isNewEstate(estate)

    if (isNew && !isSelectingParcels) {
      onCreateEstate(estate)
    } else if (!isNew && isSelectingParcels) {
      onEditEstateParcels(estate)
    } else {
      onEditEstateMetadata(estate)
    }
  }

  handlePageChange = () => {
    this.setState({ isSelectingParcels: !this.state.isSelectingParcels })
  }

  handleCancel = () => {
    this.props.onCancel()
  }

  render() {
    const { id, x, y } = this.props

    if (!id) {
      return (
        <Parcel x={x} y={y} shouldBeAllowedTo={[ACTIONS.createEstate]}>
          {() => this.renderCreateEstate(getInitialEstate(x, y))}
        </Parcel>
      )
    }

    return (
      <Estate id={id} shouldBeAllowedTo={[ACTIONS.transfer]}>
        {estate => this.renderEditEstateParcels(estate)}
      </Estate>
    )
  }
}
