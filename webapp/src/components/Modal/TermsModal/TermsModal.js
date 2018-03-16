import React from 'react'

import { localStorage } from 'lib/localStorage'
import { Button } from 'semantic-ui-react'

import DecentralandLogo from 'components/DecentralandLogo'
import BaseModal from '../BaseModal'

import './TermsModal.css'

export default class TermsModal extends React.PureComponent {
  static propTypes = {
    ...BaseModal.propTypes
  }

  constructor(props) {
    super(props)
    this.state = {
      acceptedTerms: false
    }
  }

  handleOnClose = () => {
    if (this.state.acceptedTerms) {
      this.props.onClose()
      localStorage.setItem('seenTermsModal', new Date().getTime())
    }
  }

  onAgree = () => {
    this.setState({ acceptedTerms: true }, this.handleOnClose)
  }

  render() {
    return (
      <BaseModal
        className="TermsModal modal-lg"
        {...this.props}
        onClose={this.handleOnClose}
      >
        <div className="banner">
          <h2>
            <DecentralandLogo />
          </h2>
        </div>

        <div className="modal-body">
          <div className="text">
            <h3>Welcome to the LAND Marketplace</h3>
            <p>
              This dApp interacts with a <strong>decentralized exchange</strong>{' '}
              that runs on the Ethereum blockchain.
            </p>
            <p>
              By choosing &quot;I agree&quot; below, you agree to our{' '}
              <a
                href="https://market.decentraland.org/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>.
            </p>
            <p>
              You also agree to our{' '}
              <a
                href="https://market.decentraland.org/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>, which describes how we process your information.
            </p>
          </div>

          <div className="get-started">
            <Button primary={true} onClick={this.onAgree}>
              I AGREE
            </Button>
          </div>
        </div>
      </BaseModal>
    )
  }
}
