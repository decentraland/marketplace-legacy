import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Form, Button, Input, Message } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { preventDefault, formatMana } from 'lib/utils'
import { ASSET_TYPES } from 'shared/asset'
import BaseModal from '../BaseModal'

import './FatfingerModal.css'

export default class FatfingerModal extends React.PureComponent {
  static propTypes = {
    data: PropTypes.any
  }

  constructor(props) {
    super(props)

    this.state = {
      price: '',
      formErrors: []
    }
  }

  getAssetName(assetType) {
    return assetType === ASSET_TYPES.parcel
      ? t('name.parcel')
      : t('name.estate')
  }

  handlePriceChange = e => {
    // Dots and commas are not allowed
    const price = e.currentTarget.value.replace(/\.|,/g, '')

    this.setState({
      price,
      formErrors: []
    })
  }

  handlePublish = () => {
    const { onClose, data } = this.props
    const { price } = this.state
    const { priceToConfirm, onSubmit } = data

    if (parseInt(price) !== parseInt(priceToConfirm)) {
      this.setState({ formErrors: [t('fatfinger_modal.error')] })
    } else {
      onSubmit()
      onClose()
    }
  }

  refInput = inputWrapper => {
    const actualInput = inputWrapper
      ? ReactDOM.findDOMNode(inputWrapper).querySelector('input') // eslint-disable-line
      : null
    if (actualInput) {
      actualInput.onpaste = e => e.preventDefault()
    }
  }

  renderFatfingerForm = () => {
    const { onClose, data } = this.props
    const { formErrors, price } = this.state
    const { assetType, priceToConfirm } = data
    return (
      <div className="modal-body">
        <h1 className="title">{t('global.confirm')}</h1>
        <div className="description">
          <p>
            {t('fatfinger_modal.description', {
              price: formatMana(priceToConfirm),
              asset_name: this.getAssetName(assetType)
            })}
          </p>
          <p>{t('fatfinger_modal.re-enter')}</p>
        </div>
        <Form
          onSubmit={preventDefault(this.handlePublish)}
          error={!!formErrors}
        >
          <Form.Field>
            <Input
              type="number"
              placeholder={t('asset_publish.price_placeholder', {
                asset_name: this.getAssetName(assetType)
              })}
              value={price}
              autoFocus={true}
              required={true}
              onChange={this.handlePriceChange}
              ref={this.refInput}
            />
          </Form.Field>
          {formErrors.length > 0 ? (
            <Message error onDismiss={this.handleClearFormErrors}>
              {formErrors.map((error, index) => <div key={index}>{error}</div>)}
            </Message>
          ) : null}
          <div className="modal-buttons">
            <Button onClick={onClose} type="button">
              {t('global.cancel')}
            </Button>
            <Button type="submit" primary={true} disabled={false}>
              {t('global.submit')}
            </Button>
          </div>
        </Form>
      </div>
    )
  }

  render() {
    return (
      <BaseModal
        className="FatfingerModal modal-lg"
        isCloseable={false}
        {...this.props}
      >
        {this.renderFatfingerForm()}
      </BaseModal>
    )
  }
}
