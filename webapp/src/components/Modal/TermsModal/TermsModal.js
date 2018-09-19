import React from 'react'

import { Button } from 'semantic-ui-react'
import { getLocalStorage } from '@dapps/lib/localStorage'

import { locations } from 'locations'
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
      const localStorage = getLocalStorage()
      localStorage.setItem('seenTermsModal', new Date().getTime())
    }
  }

  onAgree = () => {
    this.setState({ acceptedTerms: true }, this.handleOnClose)
  }

  render() {
    const { pathname } = this.props.location
    if (pathname === locations.root()) {
      return null
    }
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
            <h3>Welcome to Decentraland&apos;s LAND Marketplace</h3>
            <p>
              This dApp interacts with a <strong>decentralized exchange</strong>{' '}
              that runs on the Ethereum blockchain.
            </p>
            <p>
              By choosing &quot;I agree&quot; below, you agree to our{' '}
              <a
                href="https://decentraland.org/terms"
                rel="noopener noreferrer"
                target="_blank"
              >
                Terms of Service
              </a>.
            </p>
            <p>
              You also agree to our{' '}
              <a
                href="https://decentraland.org/privacy"
                rel="noopener noreferrer"
                target="_blank"
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
