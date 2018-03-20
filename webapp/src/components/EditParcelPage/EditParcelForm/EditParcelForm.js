import React from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Input } from 'semantic-ui-react'
import { parcelType } from 'components/types'
import TxStatus from 'components/TxStatus'
import { preventDefault } from 'lib/utils'
import { t } from 'modules/translation/utils'

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

  handleCancel = () => {
    this.props.onCancel()
  }

  hasChanged() {
    const { data } = this.props.parcel

    return (
      this.state.name !== data.name ||
      this.state.description !== data.description
    )
  }

  handleSubmit = () => {
    if (this.hasChanged()) {
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
    const { isTxIdle } = this.props
    const { name, description } = this.state

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
            error={name.length > 50}
          />
        </Form.Field>
        <Form.Field>
          <label>{t('parcel_edit.description')}</label>
          <Input
            type="text"
            value={description}
            onChange={this.handleDescriptionChange}
            error={name.length > 140}
          />
          <TxStatus.Idle isIdle={isTxIdle} />
        </Form.Field>
        <br />
        <div className="text-center">
          <Button type="button" onClick={this.handleCancel}>
            {t('global.cancel')}
          </Button>
          <Button
            type="submit"
            primary={true}
            disabled={!this.hasChanged() || isTxIdle}
          >
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
