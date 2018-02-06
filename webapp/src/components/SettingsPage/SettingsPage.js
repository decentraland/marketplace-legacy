import React from 'react'
import PropTypes from 'prop-types'

// import { locations } from 'locations'
import Navbar from 'components/Navbar'
import Loading from 'components/Loading'
import Button from 'components/Button'

import { walletType } from 'components/types'

import './SettingsPage.css'

export default class SettingsPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    isLoading: PropTypes.bool,
    onConnect: PropTypes.func
  }
  componentWillMount() {
    this.props.onConnect()
  }

  handleLandAuthorizedChange = e => {
    if (e.currentTarget.checked) {
      console.log('authorize LAND')
    } else {
      console.log('DE-authorize LAND')
    }
  }

  handleManaAuthorizedChange = e => {
    if (e.currentTarget.type !== 'checkbox' || e.currentTarget.checked) {
      // Support both a checkbox click and a element click
      console.log('authorize MANA')
    } else {
      console.log('DE-authorize MANA')
    }
  }

  render() {
    const { isLoading, wallet } = this.props
    const email = ''

    return (
      <div className="SettingsPage">
        <Navbar />

        {isLoading ? (
          <Loading />
        ) : (
          <div className="container">
            <h2 className="title">Settings</h2>

            <div className="row">
              <div className="col-xs-12 col-sm-offset-3 col-sm-6">
                <SettingsForm
                  address={wallet.address}
                  email={email}
                  manaAuthorized={1000}
                  onManaAuthorizedChange={this.handleManaAuthorizedChange}
                  isLandAuthorized={true}
                  onLandAuthorizedChange={this.handleLandAuthorizedChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

function SettingsForm(props) {
  const {
    address,
    // email,
    manaAuthorized,
    onManaAuthorizedChange,
    isLandAuthorized,
    onLandAuthorizedChange
  } = props

  return (
    <div className="SettingsForm">
      <form action="" method="POST">
        <div className="InputGroup">
          <label htmlFor="address">Wallet address</label>
          <input
            id="address"
            className="input"
            disabled={true}
            type="text"
            value={address}
          />
        </div>

        {/*<div className="InputGroup">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            className="input"
            type="text"
            value={email}
            placeholder="Example: youremail@gmail.com"
          />
        </div>*/}

        <div className="InputGroup">
          <input
            type="checkbox"
            value={manaAuthorized > 0}
            onChange={onManaAuthorizedChange}
          />

          {manaAuthorized > 0 ? (
            <p className="authorize-detail">
              You have {manaAuthorized} MANA authorized to be used by the
              contract.<br />
              <span className="link" onClick={onManaAuthorizedChange}>
                Authorize more
              </span>
            </p>
          ) : (
            <p className="authorize-detail">
              Authorize MANA usage for the contract
            </p>
          )}
        </div>

        <div className="InputGroup">
          <input
            type="checkbox"
            value={isLandAuthorized}
            onChange={onLandAuthorizedChange}
          />

          <p className="authorize-detail">
            {isLandAuthorized
              ? 'You have authorized the Marketplace contract to operate LAND on your behalf'
              : 'Authorize the Marketplace contract to operate LAND on your behalf'}
          </p>
        </div>

        <div className="text-center">
          <Button isSubmit={true}>SAVE</Button>
        </div>
      </form>
    </div>
  )
}

SettingsForm.propTypes = {
  address: PropTypes.string,
  email: PropTypes.string,
  manaAuthorized: PropTypes.number,
  onManaAuthorizedChange: PropTypes.bool,
  isLandAuthorized: PropTypes.bool,
  onLandAuthorizedChange: PropTypes.func
}
