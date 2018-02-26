import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input } from 'semantic-ui-react'
import { parcelType } from 'components/types'
import { preventDefault } from 'lib/utils'

import './EditParcelForm.css'

export default class EditParcelPage extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    const { data } = this.props.parcel
    this.state = {
      name: data.name || '',
      description: data.description || ''
    }
  }

  handleNameChange = event => {
    this.setState({ name: event.target.value })
  }

  handleDescriptionChange = event => {
    this.setState({ description: event.target.value })
  }

  isDisabled() {
    return !this.state.name || !this.state.description
  }

  handleSubmit = () => {
    if (!this.isDisabled()) {
      const { parcel, onSubmit } = this.props
      const { name, description } = this.state
      onSubmit({
        ...parcel,
        data: {
          ...parcel.data,
          name,
          description
        }
      })
    }
  }

  render() {
    const { onCancel } = this.props
    const { name, description } = this.state

    return (
      <Form
        className="EditParcelForm"
        onSubmit={preventDefault(this.handleSubmit)}
      >
        <Form.Field>
          <label>Name</label>
          <Input
            type="text"
            value={name}
            required={true}
            onChange={this.handleNameChange}
            error={name.length > 50}
          />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <Input
            type="text"
            value={description}
            required={true}
            onChange={this.handleDescriptionChange}
            error={name.length > 140}
          />
        </Form.Field>
        <br />
        <div className="text-center">
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" primary={true}>
            Submit
          </Button>
        </div>
      </Form>
    )
  }
}
