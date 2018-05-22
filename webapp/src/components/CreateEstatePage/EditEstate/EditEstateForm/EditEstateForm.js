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
    const { value: estate } = this.props
    this.state = {
      initialEstate: estate
    }
  }

  handleNameChange = event => {
    const { value: estate, onChange } = this.props
    onChange({
      ...estate,
      data: {
        ...estate.data,
        name: event.target.value
      }
    })
  }

  handleDescriptionChange = event => {
    const { value: estate, onChange } = this.props
    onChange({
      ...estate,
      data: {
        ...estate.data,
        description: event.target.value
      }
    })
  }

  hasChanged() {
    const { data } = this.props.value
    const { name, description } = this.state.initialEstate

    return (
      name !== data.name ||
      description !== data.description
    )
  }

  render() {
    const { onCancel, onSubmit, value: estate } = this.props
    const { name, description } = estate.data

    return (
      <Form
        className="EditEstateForm"
        onSubmit={preventDefault(onSubmit)}
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
          <Button type="button" onClick={onCancel}>
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
