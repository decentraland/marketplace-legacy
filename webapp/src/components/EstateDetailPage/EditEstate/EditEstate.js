import React from 'react'
import PropTypes from 'prop-types'

import { estateType, walletType } from 'components/types'
import EstateSelect from '../EstateSelect'
import EditEstateMetadata from '../EditEstateMetadata'
import { isNewAsset } from 'shared/asset'

export default class EditEstate extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    wallet: walletType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    isCreation: PropTypes.bool.isRequired,
    isSelecting: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    onEditEstateParcels: PropTypes.func.isRequired,
    onCreateEstate: PropTypes.func.isRequired,
    onEditEstateMetadata: PropTypes.func.isRequired
  }

  static defaultProps = {
    isSelecting: true
  }

  constructor(props) {
    super(props)
    this.state = {
      isSelecting: props.isSelecting,
      estate: props.estate
    }
  }

  handleSwitch = () => {
    this.setState({ isSelecting: !this.state.isSelecting })
  }

  handleChangeParcels = parcels => {
    const { estate } = this.state
    this.setState({
      estate: {
        ...estate,
        data: {
          ...estate.data,
          parcels
        }
      }
    })
  }

  handleChange = estate => {
    this.setState({ ...this.state, estate })
  }

  handleSubmit = () => {
    const { estate, isSelecting } = this.state
    const {
      onCreateEstate,
      onEditEstateParcels,
      onEditEstateMetadata
    } = this.props
    if (isNewAsset(estate) || isSelecting) {
      isNewAsset(estate) ? onCreateEstate(estate) : onEditEstateParcels(estate)
    } else {
      onEditEstateMetadata(estate)
    }
  }

  render() {
    const { isSelecting, estate } = this.state
    const { wallet, isCreation, onCancel } = this.props

    return (
      <React.Fragment>
        {isSelecting ? (
          <EstateSelect
            estate={estate}
            onContinue={this.handleSwitch}
            onChange={this.handleChangeParcels}
            onSubmit={this.handleSubmit}
            onCancel={onCancel}
            wallet={wallet}
            isCreation={isCreation}
          />
        ) : (
          <EditEstateMetadata
            estate={estate}
            isCreation={isCreation}
            onCancel={isCreation ? this.handleSwitch : onCancel}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
          />
        )}
      </React.Fragment>
    )
  }
}
