import React from 'react'
import PropTypes from 'prop-types'
import { Button, Loader } from 'semantic-ui-react'
import { t, T } from '@dapps/modules/translation/utils'

import ContractLink from 'components/ContractLink'
import { parcelType } from 'components/types'
import { TOKEN_SYMBOLS } from 'modules/auction/utils'
import BaseModal from '../BaseModal'

import './BidConfirmationModal.css'

export default class BidConfirmationModal extends React.PureComponent {
  static propTypes = {
    ...BaseModal.propTypes,
    token: PropTypes.oneOf(TOKEN_SYMBOLS),
    parcels: PropTypes.arrayOf(parcelType),
    beneficiary: PropTypes.string,
    isAuthorized: PropTypes.bool,
    isAuthorizing: PropTypes.bool,
    hasError: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    onAuthorize: PropTypes.func
  }

  handleSubmit = () => {
    const { parcels, beneficiary, isAuthorized, onClose, onSubmit } = this.props
    if (isAuthorized) {
      onClose()
      onSubmit(parcels, beneficiary)
    }
  }

  handleAuthorize = () => {
    const { token, onAuthorize } = this.props
    onAuthorize(token)
  }

  renderConfirmation = () => {
    const { parcels, token, price, onClose } = this.props
    return (
      <div className="modal-body">
        <h1 className="title">{t('auction_modal.confirmation')}</h1>

        <div className="description">
          <T
            id="auction_modal.confirmation_description"
            values={{
              parcels: parcels.length,
              token,
              price
            }}
          />
        </div>

        <div className="actions">
          <Button primary onClick={this.handleSubmit}>
            {t('auction_modal.submit')}
          </Button>

          <Button onClick={onClose}>{t('global.cancel')}</Button>
        </div>
      </div>
    )
  }

  renderAuthorization = () => {
    const { token, isAuthorizing, hasError, onClose } = this.props
    return (
      <div className="modal-body">
        <h1 className="title">{t('auction_modal.authorization')}</h1>

        <div className="description">
          <T
            id="auction_modal.authorization_description"
            values={{
              contract_link: <ContractLink contractName="LANDAuction" />,
              token
            }}
          />
        </div>

        <div className="actions">
          {isAuthorizing ? (
            <div className="processing-tx">
              <span>{t('auction_modal.processing_tx')}</span>
              <Loader active size="tiny" />
            </div>
          ) : hasError ? (
            <div className="processing-tx">
              <span>{t('auction_modal.tx_failed')}</span>
              <span className="retry" onClick={this.handleAuthorize}>
                {t('global.retry')}
              </span>
            </div>
          ) : (
            <Button primary onClick={this.handleAuthorize}>
              {t('auction_modal.authorize_token', { token })}
            </Button>
          )}
          <Button disabled={isAuthorizing} onClick={onClose}>
            {t('global.cancel')}
          </Button>
        </div>
      </div>
    )
  }

  render() {
    const { isAuthorized } = this.props
    return (
      <BaseModal
        className="BidConfirmationModal modal-lg"
        isCloseable={false}
        {...this.props}
      >
        {isAuthorized ? this.renderConfirmation() : this.renderAuthorization()}
      </BaseModal>
    )
  }
}
