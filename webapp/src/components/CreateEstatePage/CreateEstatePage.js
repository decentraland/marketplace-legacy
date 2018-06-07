import React from 'react'
import PropTypes from 'prop-types'

import EstateSelect from './EstateSelect'
import EditEstate from './EditEstate'

export default class CreateEstatePage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    createEstate: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    const { x, y } = this.props
    this.state = {
      estate: {
        data: {
          name: '',
          description: '',
          parcels: [{ x, y }]
        }
      },
      isSelecting: true
    }
  }

  handleSwitch = () => {
    this.setState({ isSelecting: !this.state.isSelecting })
  }

  handleChangeParcels = parcels => {
    const { estate } = this.state
    this.setState({
      estate: {
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
    this.props.createEstate(this.state.estate)
  }

  render() {
    const { isSelecting, estate } = this.state

    return (
      <React.Fragment>
        {isSelecting ? (
          <EstateSelect
            parcels={estate.data.parcels}
            onContinue={this.handleSwitch}
            onChange={this.handleChangeParcels}
          />
        ) : (
          <EditEstate
            estate={estate}
            onCancel={this.handleSwitch}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
          />
        )}
      </React.Fragment>
    )
  }
}
