import React from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Input } from 'semantic-ui-react'
import { parcelType } from 'components/types'
import TxStatus from 'components/TxStatus'
import { preventDefault } from 'lib/utils'

import './EditParcelForm.css'

export default class EditParcelForm extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    isTxIdle: PropTypes.bool,
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

  isFormValid() {
    return !this.state.name || !this.state.description
  }

  handleSubmit = () => {
    if (!this.isFormValid()) {
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
    const { isTxIdle, onCancel } = this.props
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
          <TxStatus.Idle isIdle={isTxIdle} />
        </Form.Field>
        <br />
        <div className="text-center">
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            primary={true}
            disabled={this.isFormValid() || isTxIdle}
          >
            Submit
          </Button>
        </div>
      </Form>
    )
  }
}
