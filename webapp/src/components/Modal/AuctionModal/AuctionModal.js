import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox, Button } from 'semantic-ui-react'
import { t, T } from '@dapps/modules/translation/utils'

import {
  hasAgreedToTerms as hasAgreedToOtherTerms,
  agreeToTerms as agreeToOtherTerms
} from 'modules/terms/utils'
import {
  dismissAuctionHelper,
  AUCTION_HELPERS,
  getYoutubeTutorialId
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
      hasAgreedToOtherTerms: hasAgreedToOtherTerms(),
      isWatchingTutorial: false
    }
  }

  handleTermsAgreement = (_, data) => {
    this.setState({ hasAgreedToTerms: data.checked })
  }

  handleOtherTermsAgreement = (_, data) => {
    this.setState({ hasAgreedToOtherTerms: data.checked })
  }

  handleWatchTutorial = () => {
    this.setState({ isWatchingTutorial: true })
  }

  handleCloseTutorial = () => {
    this.setState({ isWatchingTutorial: false })
  }

  handleSubmit = () => {
    if (!hasAgreedToOtherTerms()) {
      agreeToOtherTerms()
    }
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

  renderAuctionTermsLink() {
    return (
      <a
        href="https://decentraland.org/terms-auction"
        rel="noopener noreferrer"
        target="_blank"
      >
        {t('auction_modal.auction_terms_link')}
      </a>
    )
  }

  renderDecentralandTermsLink() {
    return (
      <a
        href="https://decentraland.org/terms"
        rel="noopener noreferrer"
        target="_blank"
      >
        {t('auction_modal.decentraland_terms_link')}
      </a>
    )
  }

  renderPrivacyPolicyLink() {
    return (
      <a
        href="https://decentraland.org/privacy"
        rel="noopener noreferrer"
        target="_blank"
      >
        {t('auction_modal.privacy_policy_link')}
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
            src={`https://www.youtube-nocookie.com/embed/${getYoutubeTutorialId()}`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  renderWelcome() {
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
        <h1 className="title">{t('auction.title')}</h1>

        <div className="description">{t('auction_modal.description')}</div>

        <div className="agree-to-terms-wrapper">
          <div className="agree-to-terms">
            <Checkbox
              checked={this.state.hasAgreedToTerms}
              onChange={this.handleTermsAgreement}
              label={
                <label>
                  <T
                    id="auction_modal.i_agree_with_auction_terms"
                    values={{
                      auction_terms_link: this.renderAuctionTermsLink()
                    }}
                  />
                </label>
              }
            />
            {!hasAgreedToOtherTerms() ? (
              <Checkbox
                checked={this.state.hasAgreedToOtherTerms}
                onChange={this.handleOtherTermsAgreement}
                label={
                  <label>
                    <T
                      id={'auction_modal.i_agree_with_other_terms'}
                      values={{
                        decentraland_terms_link: this.renderDecentralandTermsLink(),
                        privacy_policy_link: this.renderPrivacyPolicyLink()
                      }}
                    />
                  </label>
                }
              />
            ) : null}
          </div>
        </div>

        <div className="actions">
          <Button
            primary={true}
            disabled={
              !this.state.hasAgreedToTerms || !this.state.hasAgreedToOtherTerms
            }
            onClick={this.handleSubmit}
          >
            {t('auction_modal.get_started').toUpperCase()}
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
