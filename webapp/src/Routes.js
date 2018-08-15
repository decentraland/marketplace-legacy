import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { isFeatureEnabled } from 'lib/featureUtils'
import { locations } from 'locations'

import Intercom from 'components/Intercom'
import Modal from 'components/Modal'
import Toast from 'components/Toast'
import Wallet from 'components/Wallet'
import Page from 'components/Page'

import HomePage from 'components/HomePage'
import AtlasPage from 'components/AtlasPage'
import ParcelDetailPage from 'components/ParcelDetailPage'
import MarketplacePage from 'components/MarketplacePage'
import ProfilePage from 'components/ProfilePage'
import PublishPage from 'components/PublishPage'
import EditParcelPage from 'components/EditParcelPage'
import TransferParcelPage from 'components/TransferParcelPage'
import EstateDetailPage from 'components/EstateDetailPage'
import ManageParcelPage from 'components/ManageParcelPage'
import BuyParcelPage from 'components/BuyParcelPage'
import CancelSalePage from 'components/CancelSalePage'
import ActivityPage from 'components/ActivityPage'
import SettingsPage from 'components/SettingsPage'
import SignInPage from 'components/SignInPage'
import TransferManaPage from 'components/TransferManaPage'
import BuyManaPage from 'components/BuyManaPage'
import BuyParcelByMortgagePage from 'components/BuyParcelByMortgagePage'
import PayMortgagePage from 'components/PayMortgagePage'
import ColorKeyPage from 'components/ColorKeyPage'
import PrivacyPage from 'components/PrivacyPage'
import TermsPage from 'components/TermsPage'
import DeleteEstatePage from 'components/DeleteEstatePage'

export default class Routes extends React.Component {
  renderRoutes() {
    return (
      <Switch>
        <Route exact path={locations.root} component={HomePage} />
        {isFeatureEnabled('ESTATES') && (
          <Route
            exact
            path={locations.createEstate}
            component={EstateDetailPage}
          />
        ) /* Estate Feature */}
        {isFeatureEnabled('ESTATES') && (
          <Route exact path={locations.estate} component={EstateDetailPage} />
        ) /* Estate Feature */}
        {isFeatureEnabled('ESTATES') && (
          <Route
            exact
            path={locations.ediEstateParcels}
            component={props => (
              <EstateDetailPage
                isSelecting={true}
                isEditing={true}
                {...props}
              />
            )}
          />
        ) /* Estate Feature */}
        {isFeatureEnabled('ESTATES') && (
          <Route
            exact
            path={locations.ediEstateMetadata}
            component={props => (
              <EstateDetailPage
                isSelecting={false}
                isEditing={true}
                {...props}
              />
            )}
          />
        ) /* Estate Feature */}
        {isFeatureEnabled('ESTATES') && (
          <Route
            exact
            path={locations.deleteEstate}
            component={DeleteEstatePage}
          />
        ) /* Estate Feature */}
        <Route exact path={locations.parcel} component={ParcelDetailPage} />
        <Route exact path={locations.marketplace} component={MarketplacePage} />
        <Route exact path={locations.profile} component={ProfilePage} />
        <Route exact path={locations.sell} component={PublishPage} />
        <Route exact path={locations.edit} component={EditParcelPage} />
        <Route exact path={locations.transfer} component={TransferParcelPage} />
        <Route exact path={locations.manage} component={ManageParcelPage} />
        <Route exact path={locations.buy} component={BuyParcelPage} />
        <Route exact path={locations.cancelSale} component={CancelSalePage} />
        <Route exact path={locations.activity} component={ActivityPage} />
        <Route exact path={locations.settings} component={SettingsPage} />
        <Route exact path={locations.colorKey} component={ColorKeyPage} />
        <Route exact path={locations.privacy} component={PrivacyPage} />
        <Route exact path={locations.terms} component={TermsPage} />
        <Route exact path={locations.parcelMap} component={AtlasPage} />
        <Route exact path={locations.signIn} component={SignInPage} />
        <Route
          exact
          path={locations.transferMana}
          component={TransferManaPage}
        />
        <Route exact path={locations.buyMana} component={BuyManaPage} />
        {isFeatureEnabled('MORTGAGES') && (
          <Route
            exact
            path={locations.mortgage}
            component={BuyParcelByMortgagePage}
          />
        ) /* Mortgage Feature */}
        {isFeatureEnabled('MORTGAGES') && (
          <Route
            exact
            path={locations.payMortgagePath}
            component={PayMortgagePage}
          />
        )
        /* Mortgage Feature */
        }
        <Redirect to={locations.root} />
      </Switch>
    )
  }

  render() {
    return (
      <Wallet>
        <Page>{this.renderRoutes()}</Page>
        <Modal />
        <Toast />
        <Intercom />
      </Wallet>
    )
  }
}
