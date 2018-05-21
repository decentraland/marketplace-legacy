import React from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Input } from 'semantic-ui-react'
import { preventDefault } from 'lib/utils'
import { t } from 'modules/translation/utils'

import './EditEstateForm.css'

export default class EditEstateForm extends React.PureComponent {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    const { data } = this.props.value
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

  handleCancel = () => {
    this.props.onCancel()
  }

  hasChanged() {
    const { data } = this.props.value

    return (
      this.state.name !== data.name ||
      this.state.description !== data.description
    )
  }

  handleSubmit = () => {
    if (this.hasChanged()) {
      const { value: estate, onSubmit } = this.props
      const { name, description } = this.state
      onSubmit({
        ...estate,
        data: {
          ...estate.data,
          name,
          description
        }
      })
    }
  }

  render() {
    const { name, description } = this.state

    return (
      <Form
        className="EditEstateForm"
        onSubmit={preventDefault(this.handleSubmit)}
      >
        <Form.Field>
          <label>{t('estate_edit.name')}</label>
          <Input
            type="text"
            value={name}
            onChange={this.handleNameChange}
            error={name.length > 50}
          />
        </Form.Field>
        <Form.Field>
          <label>{t('estate_edit.description')}</label>
          <Input
            type="text"
            value={description}
            onChange={this.handleDescriptionChange}
            error={name.length > 140}
          />
        </Form.Field>
        <br />
        <div>
          <Button type="button" onClick={this.handleCancel}>
            {t('global.cancel')}
          </Button>
          <Button type="submit" primary={true} disabled={!this.hasChanged()}>
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
