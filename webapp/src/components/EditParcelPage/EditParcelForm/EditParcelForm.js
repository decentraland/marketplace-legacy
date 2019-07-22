import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input, Message } from 'semantic-ui-react'

import { parcelType } from 'components/types'
import TxStatus from 'components/TxStatus'
import { t } from '@dapps/modules/translation/utils'
import {
  isValidName,
  isValidDescription,
  MAX_NAME_LENGTH,
  MAX_DESCRIPTION_LENGTH
} from 'shared/asset'
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
      description: data.description || '',
      ipns: data.ipns || '',
      formErrors: []
    }
  }

  handleNameChange = event => {
    this.setState({ name: event.target.value, formErrors: [] })
  }

  handleDescriptionChange = event => {
    this.setState({ description: event.target.value, formErrors: [] })
  }

  handleIpnsChange = event => {
    this.setState({ ipns: event.target.value, formErrors: [] })
  }

  handleSubmit = () => {
    if (this.hasChanged()) {
      const { parcel, onSubmit } = this.props
      const { name, description, ipns } = this.state
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
          ...parcel,
          data: {
            ...parcel.data,
            name,
            description,
            ipns
          }
        })
      } else {
        this.setState({ formErrors })
      }
    }
  }

  handleCancel = () => {
    this.props.onCancel()
  }

  hasChanged() {
    const { name = '', description = '', ipns = '' } = this.props.parcel.data

    return (
      this.state.name !== name ||
      this.state.description !== description ||
      this.state.ipns !== ipns
    )
  }

  isValidName(name) {
    return !this.hasChanged() || isValidName(name)
  }

  isValidDescription(description) {
    return !this.hasChanged() || isValidDescription(description)
  }

  handleClearFormErrors = () => {
    this.setState({ formErrors: [] })
  }

  render() {
    const { isTxIdle } = this.props
    const { name, description, ipns, formErrors } = this.state

    return (
      <Form
        className="EditParcelForm"
        error={!!formErrors}
        onSubmit={preventDefault(this.handleSubmit)}
      >
        <Form.Field>
          <label>{t('parcel_edit.name')}</label>
          <Input
            type="text"
            value={name}
            onChange={this.handleNameChange}
            error={!this.isValidName(name)}
            autoFocus
          />
        </Form.Field>
        <Form.Field>
          <label>{t('parcel_edit.description')}</label>
          <Input
            type="text"
            value={description}
            onChange={this.handleDescriptionChange}
            error={!this.isValidDescription(description)}
          />
        </Form.Field>
        <Form.Field>
          <label>{t('parcel_edit.ipns')}</label>
          <Input
            type="text"
            icon="warning sign"
            value={ipns}
            onChange={this.handleIpnsChange}
            className="ipns-input"
          />
          <span
            className="warning-tooltip"
            data-balloon={t('parcel_edit.warning_tooltip')}
            data-balloon-pos="up"
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
