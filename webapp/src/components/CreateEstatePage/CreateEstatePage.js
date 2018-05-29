import React from 'react'
import PropTypes from 'prop-types'

import EstateSelect from './EstateSelect'
import EditEstate from './EditEstate'

export default class CreateEstatePage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired,
    createEstate: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    const x = parseInt(this.props.x, 10)
    const y = parseInt(this.props.y, 10)
    this.state = {
      estate: {
        data: {
          name: '',
          description: '',
          parcels: [{ x, y }]
        },
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
        ...estate, data: {
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

    return isSelecting ? (
      <React.Fragment>
        <EstateSelect
          value={estate.data.parcels}
          onContinue={this.handleSwitch}
          onChange={this.handleChangeParcels}
        />
      </React.Fragment>
    ) : (
        <React.Fragment>
          <EditEstate
            value={estate}
            onCancel={this.handleSwitch}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
          />
        </React.Fragment>
      )
  }
}
