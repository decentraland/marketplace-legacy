import React from 'react'
import PropTypes from 'prop-types'

import EstateSelect from './EstateSelect'
import EstateModal from './EstateModal'

export default class CreateEstatePage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired,
    onEstateCreation: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    const x = parseInt(this.props.x, 10)
    const y = parseInt(this.props.y, 10)
    this.state = {
      estate: {
        parcels: [{ x, y }]
      },
      isSelecting: true
    }
  }

  handleSwitch = () => {
    this.setState({ isSelecting: !this.state.isSelecting })
  }

  handleChangeParcels = parcels => {
    this.setState({ estate: { parcels } })
  }

  handleSubmit = () => {
    this.props.onEstateCreation(this.state.estate)
  }

  render() {
    return this.state.isSelecting ? (
      <React.Fragment>
        <EstateSelect
          value={this.state.estate.parcels}
          onContinue={this.handleSwitch}
          onChange={this.handleChangeParcels}
        />
      </React.Fragment>
    ) : (
      <React.Fragment>
        <EstateModal
          value={this.state.estate}
          onReturn={this.handleSwitch}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        />
      </React.Fragment>
    )
  }
}
