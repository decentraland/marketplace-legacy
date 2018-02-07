import React from 'react'
import PropTypes from 'prop-types'

// import { locations } from 'locations'
import Navbar from 'components/Navbar'
import Loading from 'components/Loading'
import Button from 'components/Button'

import { walletType } from 'components/types'

import './SettingsPage.css'

const MANA_TO_APPROVE = 100000 // 100k

export default class SettingsPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    isLoading: PropTypes.bool,
    onConnect: PropTypes.func,
    onApproveMana: PropTypes.func,
    onAuthorizeLand: PropTypes.func
  }

  componentWillMount() {
    this.props.onConnect()
  }

  manaApproval = e => {
    // Support both a checkbox click and a element click
    const manaToApprove =
      e.currentTarget.type !== 'checkbox' || e.currentTarget.checked
        ? MANA_TO_APPROVE
        : 0

    this.props.onApproveMana(manaToApprove)
  }

  handleLandAuthorization = e => {
    this.props.onAuthorizeLand(e.currentTarget.checked)
  }

  render() {
    const { isLoading, wallet } = this.props
    const { address, approvedBalance, landIsAuthorized } = wallet
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
                  address={address}
                  email={email}
                  manaAuthorized={approvedBalance}
                  onManaAuthorizedChange={this.handleManaApproval}
                  isLandAuthorized={landIsAuthorized}
                  onLandAuthorizedChange={this.handleLandAuthorization}
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
              {manaAuthorized < MANA_TO_APPROVE && (
                <span
                  className="link"
                  data-balloon={`You will authorize ${MANA_TO_APPROVE.toLocaleString()} MANA`}
                  data-balloon-pos="up"
                  onClick={onManaAuthorizedChange}
                >
                  Authorize more
                </span>
              )}
            </p>
          ) : (
            <p className="authorize-detail">
              Authorize {MANA_TO_APPROVE.toLocaleString()} MANA usage for the
              contract
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
  onManaAuthorizedChange: PropTypes.func,
  isLandAuthorized: PropTypes.bool,
  onLandAuthorizedChange: PropTypes.func
}
