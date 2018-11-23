import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox, Button } from 'semantic-ui-react'
import { t, T } from '@dapps/modules/translation/utils'

import ContractLink from 'components/ContractLink'
import {
  dismissAuctionHelper,
  AUCTION_HELPERS,
  getVideoTutorialLink
} from 'modules/auction/utils'

import BaseModal from '../BaseModal'

import './AuctionModal.css'

export default class AuctionModal extends React.PureComponent {
  static propTypes = {
    ...BaseModal.propTypes,
    onNavigateAway: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      hasAgreedToTerms: false,
      isWatchingTutorial: false
    }
  }

  handleTermsAgreement = (_, data) => {
    this.setState({ hasAgreedToTerms: data.checked })
  }

  handleWatchTutorial = () => {
    this.setState({ isWatchingTutorial: true })
  }

  handleCloseTutorial = () => {
    this.setState({ isWatchingTutorial: false })
  }

  handleSubmit = () => {
    dismissAuctionHelper(AUCTION_HELPERS.SEEN_AUCTION_MODAL)
    this.props.onClose()
  }

  handleOnClose = () => {
    if (this.state.hasAgreedToTerms) {
      this.handleSubmit()
    } else {
      const { onNavigateAway, onClose } = this.props
      onNavigateAway()
      onClose()
    }
  }

  renderTermsOfServiceLink() {
    return (
      <a
        href="https://decentraland.org/terms"
        rel="noopener noreferrer"
        target="_blank"
      >
        {t('auction_modal.terms_and_conditions')}
      </a>
    )
  }

  renderTutorial() {
    return (
      <div className="modal-body tutorial">
        <header>
          <span className="go-back" onClick={this.handleCloseTutorial}>
            &lsaquo;
          </span>
          {t('auction_modal.video_tutorial')}
        </header>
        <div className="video-container">
          <iframe
            src={getVideoTutorialLink()}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  renderWelcome() {
    const { hasAgreedToTerms } = this.state

    return (
      <div className="modal-body">
        <div className="modal-header">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            onClick={this.handleOnClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <h1 className="title">{t('auction_modal.title')}</h1>

        <div className="description">
          <T
            id="auction_modal.description"
            values={{
              contract_link: <ContractLink contractName="LANDAuction" />
            }}
          />
        </div>

        <div className="agree-to-terms">
          <Checkbox
            checked={hasAgreedToTerms}
            onChange={this.handleTermsAgreement}
            label={
              <label>
                <T
                  id="auction_modal.i_agree_with_terms"
                  values={{ terms_link: this.renderTermsOfServiceLink() }}
                />
              </label>
            }
          />
        </div>

        <div className="actions">
          <Button
            primary={true}
            disabled={!hasAgreedToTerms}
            onClick={this.handleSubmit}
          >
            {t('auction_modal.start').toUpperCase()}
          </Button>
          <Button onClick={this.handleWatchTutorial}>
            {t('auction_modal.watch_tutorial').toUpperCase()}
          </Button>
        </div>
      </div>
    )
  }

  render() {
    const { isWatchingTutorial } = this.state

    return (
      <BaseModal
        className="AuctionModal modal-lg"
        isCloseable={false}
        {...this.props}
      >
        {isWatchingTutorial ? this.renderTutorial() : this.renderWelcome()}
      </BaseModal>
    )
  }
}
