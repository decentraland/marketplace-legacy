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
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isTxIdle: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    const { estate } = this.props
    this.initialEstate = estate
    this.state = { formErrors: [] }
  }

  componentWillUnmount() {
    const { estate, onChange } = this.props
    onChange({
      ...estate,
      data: {
        ...estate.data,
        description: '',
        name: ''
      }
    })
  }

  handleNameChange = event => {
    const { estate, onChange } = this.props
    onChange({
      ...estate,
      data: {
        ...estate.data,
        name: event.target.value
      }
    })
    this.setState({ formErrors: [] })
  }

  handleDescriptionChange = event => {
    const { estate, onChange } = this.props
    onChange({
      ...estate,
      data: {
        ...estate.data,
        description: event.target.value
      }
    })
    this.setState({ formErrors: [] })
  }

  hasChanged() {
    const { data } = this.props.estate
    const { name, description } = this.initialEstate.data

    return (
      name.toString() !== data.name.toString() ||
      description.toString() !== data.description.toString()
    )
  }

  isValidName(name) {
    return !this.hasChanged() || isValidName(name)
  }

  isValidDescription(description) {
    return !this.hasChanged() || isValidDescription(description)
  }

  onSubmit = () => {
    const { name, description } = this.props.estate.data
    const formErrors = []

    if (!this.isValidName(name)) {
      formErrors.push(
        t('asset_edit.errors.name_limit', {
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
      this.props.onSubmit()
    } else {
      this.setState({ formErrors })
    }
  }

  handleClearFormErrors = () => {
    this.setState({ formErrors: [] })
  }

  render() {
    const { formErrors } = this.state
    const { onCancel, estate, isTxIdle } = this.props
    const { name, description } = estate.data

    return (
      <Form
        className="EditEstateMetadataForm"
        error={!!formErrors}
        onSubmit={preventDefault(this.onSubmit)}
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
