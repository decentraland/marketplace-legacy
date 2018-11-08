import React from 'react'
import { Button } from 'semantic-ui-react'

import DecentralandLogo from 'components/DecentralandLogo'
import { t, T } from '@dapps/modules/translation/utils'
import { agreeToTerms } from 'modules/terms/utils'

import BaseModal from '../BaseModal'

import './TermsModal.css'

export default class TermsModal extends React.PureComponent {
  static propTypes = {
    ...BaseModal.propTypes
  }

  handleOnAgree = () => {
    agreeToTerms()
    this.props.onClose()
  }

  renderTermsOfServiceLink() {
    return (
      <a
        href="https://decentraland.org/terms"
        rel="noopener noreferrer"
        target="_blank"
      >
        {t('terms_modal.terms_of_service')}
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
        {t('terms_modal.privacy_policy')}
      </a>
    )
  }

  render() {
    return (
      <BaseModal
        className="TermsModal modal-lg"
        isCloseable={false}
        {...this.props}
      >
        <DecentralandLogo />

        <div className="modal-body">
          <h1>{t('terms_modal.title')}</h1>

          <br />
          <p>
            <T id="terms_modal.explanation" />
          </p>
          <p>
            <T
              id="terms_modal.by_agreeing"
              values={{
                terms_of_service_link: this.renderTermsOfServiceLink()
              }}
            />
          </p>
          <p>
            <T
              id="terms_modal.also_agree"
              values={{ privacy_policy_link: this.renderPrivacyPolicyLink() }}
            />
          </p>
          <br />
          <br />

          <div className="agree-to-terms">
            <Button primary={true} onClick={this.handleOnAgree}>
              {t('terms_modal.i_agree').toUpperCase()}
            </Button>
          </div>
        </div>
      </BaseModal>
    )
  }
}
