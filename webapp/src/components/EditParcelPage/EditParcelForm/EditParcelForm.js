import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input } from 'semantic-ui-react'

import { parcelType } from 'components/types'
import TxStatus from 'components/TxStatus'
import { t } from '@dapps/modules/translation/utils'
import { isValidName, isValidDescription } from 'shared/asset'
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
      ipns: data.ipns || ''
    }
  }

  handleNameChange = event => {
    this.setState({ name: event.target.value })
  }

  handleDescriptionChange = event => {
    this.setState({ description: event.target.value })
  }

  handleIpnsChange = event => {
    this.setState({ ipns: event.target.value })
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

  handleSubmit = () => {
    if (this.hasChanged()) {
      const { parcel, onSubmit } = this.props
      const { name, description, ipns } = this.state
      onSubmit({
        ...parcel,
        data: {
          ...parcel.data,
          name,
          description,
          ipns
        }
      })
    }
  }

  isValidName(name) {
    return !this.hasChanged() || isValidName(name)
  }

  isValidDescription(description) {
    return !this.hasChanged() || isValidDescription(description)
  }

  render() {
    const { isTxIdle } = this.props
    const { name, description, ipns } = this.state

    const isValidName = this.isValidName(name)
    const isValidDescription = this.isValidDescription(description)

    return (
      <Form
        className="EditParcelForm"
        onSubmit={preventDefault(this.handleSubmit)}
      >
        <Form.Field>
          <label>{t('parcel_edit.name')}</label>
          <Input
            type="text"
            value={name}
            onChange={this.handleNameChange}
            error={!isValidName}
            autoFocus
          />
        </Form.Field>
        <Form.Field>
          <label>{t('parcel_edit.description')}</label>
          <Input
            type="text"
            value={description}
            onChange={this.handleDescriptionChange}
            error={!isValidDescription}
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
        <div className="modal-buttons">
          <Button type="button" onClick={this.handleCancel}>
            {t('global.cancel')}
          </Button>
          <Button
            type="submit"
            primary={true}
            disabled={!this.hasChanged() || !isValidName || !isValidDescription}
          >
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
