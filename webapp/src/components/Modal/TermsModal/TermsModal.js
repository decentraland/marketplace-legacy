import React from 'react'
import { Link } from 'react-router-dom'

import { localStorage } from 'lib/localStorage'
import { Button } from 'semantic-ui-react'

import DecentralandLogo from 'components/DecentralandLogo'
import BaseModal from '../BaseModal'

import { locations } from 'locations'

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
    const { location: { pathname } } = this.props
    if (
      pathname === locations.root ||
      pathname === locations.terms ||
      pathname === locations.privacy
    ) {
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
              <Link to={locations.terms}>Terms of Service</Link>.
            </p>
            <p>
              You also agree to our{' '}
              <Link to={locations.privacy}>Privacy Policy</Link>, which
              describes how we process your information.
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
