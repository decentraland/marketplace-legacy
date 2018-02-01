import React from 'react'
import { Switch, Route } from 'react-router'

import { locations } from 'locations'

import HomePage from 'components/HomePage'
import ParcelDetailPage from 'components/ParcelDetailPage'
import ColorKeyPage from 'components/ColorKeyPage'
import PrivacyPage from 'components/PrivacyPage'

import WalletErrorPage from 'components/WalletErrorPage'
import AddressErrorPage from 'components/AddressErrorPage'
import ServerError from 'components/ServerError'

import GoogleAnalytics from 'components/GoogleAnalytics'
import Intercom from 'components/Intercom'

import Modal from 'components/Modal'
import Toast from 'components/Toast'

export default function Routes() {
  return [
    <Switch key="1">
      <Route exact path={locations.root} component={HomePage} />
      <Route exact path={locations.parcelMap} component={HomePage} />
      <Route exact path={locations.parcel} component={ParcelDetailPage} />
      <Route exact path={locations.colorCodes} component={ColorKeyPage} />
      <Route exact path={locations.privacy} component={PrivacyPage} />
      <Route exact path={locations.walletError} component={WalletErrorPage} />
      <Route exact path={locations.addressError} component={AddressErrorPage} />
      <Route exact path={locations.serverError} component={ServerError} />
      <Route exact path={locations.error} component={WalletErrorPage} />
    </Switch>,
    <Modal key="2" />,
    <Toast key="3" />,
    <Intercom key="4" />,
    <GoogleAnalytics key="5" />
  ]
}
