import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'components/Icon'
import { parcelType } from 'components/types'

import CoordinateLink from '../CoordinateLink'

class ParcelRowEdit extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    onSubmit: PropTypes.func
  }

  constructor(props) {
    super(props)

    const { name, description } = props.parcel
    this.state = { name, description }
  }

  handleNameChange = e => {
    this.setState({
      name: e.currentTarget.value
    })
  }

  handleDescriptionChange = e => {
    this.setState({
      description: e.currentTarget.value
    })
  }

  handleSubmit = e => {
    const { parcel, onSubmit } = this.props
    const { name, description } = this.state

    onSubmit({
      ...parcel,
      name,
      description
    })

    e.preventDefault()
  }

  render() {
    const { parcel } = this.props
    const { name, description } = this.state

    return (
      <div className="parcel-row-editing">
        <div className="col col-editing">
          Editing&nbsp;&nbsp;
          <CoordinateLink parcel={parcel} />
        </div>
        <div className="col col-actions" onClick={this.handleSubmit}>
          <Icon name="tick" />
          Done
        </div>

        <form action="POST" onSubmit={this.handleSubmit}>
          <div className="editing-fields">
            <div className="field">
              <label htmlFor="name-field">NAME</label>
              <input
                type="text"
                name="name-field"
                id="name-field"
                value={name || ''}
                onChange={this.handleNameChange}
              />
            </div>

            <div className="field">
              <label htmlFor="description-field">DESCRIPTION</label>
              <textarea
                name="description"
                id="description-field"
                value={description || ''}
                onChange={this.handleDescriptionChange}
              />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default ParcelRowEdit
