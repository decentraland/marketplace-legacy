import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox, Button } from 'semantic-ui-react'
import { t, T } from '@dapps/modules/translation/utils'

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
    onNavigateAway: PropTypes.func,
    auctionFinished: PropTypes.bool.isRequired
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

  handleCloseFinishedMessage = () => {
    const { onGoToMarketplace, onClose } = this.props
    onGoToMarketplace()
    onClose()
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
          {t('auction_modal.welcome')}
          <br />
          <br />
          {t('auction_modal.description')}
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
            {t('auction_modal.get_started').toUpperCase()}
          </Button>
          <Button onClick={this.handleWatchTutorial}>
            {t('auction_modal.watch_tutorial').toUpperCase()}
          </Button>
        </div>
      </div>
    )
  }

  renderFinished() {
    const landSold = 6000
    const manaBurned = '100,000'
    const duration = '15 days'

    return (
      <div className="modal-body">
        <h1 className="title">{t('auction_modal.finished_title')}</h1>

        <div className="description">
          {t('auction_modal.finished_description')}
          <br />
          {t('auction_modal.stats_title')}
          <div className="stats">
            <div className="stat">
              <p>{landSold}</p>
              <p>{t('auction_modal.land_sold')}</p>
            </div>
            <div className="stat">
              <p>{manaBurned}</p>
              <p>{t('auction_modal.mana_burned')}</p>
            </div>
            <div className="stat">
              <p>{duration}</p>
              <p>{t('global.duration')}</p>
            </div>
          </div>
        </div>

        <div className="actions">
          <Button primary={true} onClick={this.handleCloseFinishedMessage}>
            {t('auction_modal.finished_cta').toUpperCase()}
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
        {hasAuctionFinished()
          ? this.renderFinished()
          : isWatchingTutorial
            ? this.renderTutorial()
            : this.renderWelcome()}
      </BaseModal>
    )
  }
}
