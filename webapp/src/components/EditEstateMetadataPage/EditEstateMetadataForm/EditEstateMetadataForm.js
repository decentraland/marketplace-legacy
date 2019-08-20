import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input, Message } from 'semantic-ui-react'

import TxStatus from 'components/TxStatus'
import { estateType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import { preventDefault } from 'lib/utils'
import {
  isValidName,
  isValidDescription,
  MAX_NAME_LENGTH,
  MAX_DESCRIPTION_LENGTH
} from 'shared/asset'
import './EditEstateMetadataForm.css'

export default class EditEstateMetadataForm extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    const { data } = this.props.estate
    this.state = {
      name: data.name || '',
      description: data.description || '',
      formErrors: []
    }
  }

  handleNameChange = event => {
    this.setState({ name: event.target.value, formErrors: [] })
  }

  handleDescriptionChange = event => {
    this.setState({ description: event.target.value, formErrors: [] })
  }

  handleSubmit = () => {
    const { estate, onSubmit } = this.props
    const { name, description } = this.state
    const formErrors = []

    if (!this.isValidName(name)) {
      formErrors.push(
        name.length === 0
          ? t('asset_edit.errors.name_min_limit')
          : t('asset_edit.errors.name_max_limit', {
              length: MAX_NAME_LENGTH
            })
      )
    }

    if (!this.isValidDescription(description)) {
      formErrors.push(
        t('asset_edit.errors.description_limit', {
          length: MAX_DESCRIPTION_LENGTH
        })
      )
    }

    if (formErrors.length === 0) {
      onSubmit({
        ...estate,
        data: {
          ...estate.data,
          name,
          description
        }
      })
    } else {
      this.setState({ formErrors })
    }
  }

  handleCancel = () => {
    this.props.onCancel()
  }

  handleClearFormErrors = () => {
    this.setState({ formErrors: [] })
  }

  hasChanged() {
    const { name = '', description = '' } = this.props.estate.data

    return this.state.name !== name || this.state.description !== description
  }

  isValidName(name) {
    return !this.hasChanged() || isValidName(name)
  }

  isValidDescription(description) {
    return !this.hasChanged() || isValidDescription(description)
  }

  render() {
    const { isTxIdle } = this.props
    const { name, description, formErrors } = this.state

    return (
      <Form
        className="EditEstateMetadataForm"
        error={!!formErrors}
        onSubmit={preventDefault(this.handleSubmit)}
      >
        <Form.Field>
          <label>{t('estate_edit.name')}</label>
          <Input
            type="text"
            value={name}
            onChange={this.handleNameChange}
            error={!this.isValidName(name)}
            autoFocus
          />
        </Form.Field>
        <Form.Field>
          <label>{t('estate_edit.description')}</label>
          <Input
            type="text"
            value={description}
            onChange={this.handleDescriptionChange}
            error={!this.isValidDescription(description)}
          />
        </Form.Field>
        <TxStatus.Idle isIdle={isTxIdle} />
        {formErrors.length > 0 ? (
          <Message error onDismiss={this.handleClearFormErrors}>
            {formErrors.map((error, index) => <div key={index}>{error}</div>)}
          </Message>
        ) : null}
        <div className="modal-buttons">
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
