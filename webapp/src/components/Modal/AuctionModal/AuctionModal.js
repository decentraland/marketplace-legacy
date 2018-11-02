import React from 'react'
import PropTypes from 'prop-types'
import { Loader, Button } from 'semantic-ui-react'

import ContractLink from 'components/ContractLink'
import { t } from '@dapps/modules/translation/utils'
import { dismissAuctionModal, isAuthorized } from 'modules/auction/utils'
import { authorizationType } from 'components/types'

import BaseModal from '../BaseModal'

import './AuctionModal.css'

export default class AuctionModal extends React.PureComponent {
  static propTypes = {
    ...BaseModal.propTypes,
    authorization: authorizationType,
    onAuthorize: PropTypes.func.isRequired
  }

  handleOnAuthorize = () => {
    const { onClose, onAuthorize } = this.props
    onClose()
    onAuthorize()
  }

  handleOnDismiss = () => {
    dismissAuctionModal()
    this.props.onClose()
  }

  renderBlogPostLink() {
    return (
      <a
        href="https://blog.decentraland.org"
        rel="noopener noreferrer"
        target="_blank"
      >
        {t('auction_modal.blog_post')}
      </a>
    )
  }

  renderAuthorizedModalBody() {
    return (
      <React.Fragment>
        <p>
          {t('auction_modal.authorized_explanation', {
            blog_post_link: this.renderBlogPostLink()
          })}
        </p>
        <br />
        <Button primary={true} onClick={this.handleOnDismiss}>
          {t('auction_modal.lets_go')}
        </Button>
      </React.Fragment>
    )
  }

  renderFirstTimeModalBody() {
    return (
      <React.Fragment>
        <p>
          {t('auction_modal.first_time_explanation', {
            contract_link: <ContractLink contractName="LANDAuction" />,
            blog_post_link: this.renderBlogPostLink()
          })}
        </p>
        <br />
        <Button primary={true} onClick={this.handleOnAuthorize}>
          {t('auction_modal.authorize_contract')}
        </Button>
      </React.Fragment>
    )
  }

  render() {
    const { authorization } = this.props

    return (
      <BaseModal
        className="AuctionModal modal-lg"
        isCloseable={false}
        {...this.props}
      >
        <div className="modal-body">
          {authorization == null ? (
            <div className="modal-loader-container">
              <Loader active size="massive" />
            </div>
          ) : (
            <React.Fragment>
              <h1>{t('auction_modal.title')}</h1>
              <br />

              {isAuthorized(authorization)
                ? this.renderAuthorizedModalBody()
                : this.renderFirstTimeModalBody()}
            </React.Fragment>
          )}
        </div>
      </BaseModal>
    )
  }
}
