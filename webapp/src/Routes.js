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
import PublishParcelPage from 'components/PublishParcelPage'
import PublishEstatePage from 'components/PublishEstatePage'
import EditParcelPage from 'components/EditParcelPage'
import TransferParcelPage from 'components/TransferParcelPage'
import EstateDetailPage from 'components/EstateDetailPage'
import ManageParcelPage from 'components/ManageParcelPage'
import BuyParcelPage from 'components/BuyParcelPage'
import BuyEstatePage from 'components/BuyEstatePage'
import CancelSaleParcelPage from 'components/CancelSaleParcelPage'
import CancelSaleEstatePage from 'components/CancelSaleEstatePage'
import ActivityPage from 'components/ActivityPage'
import SettingsPage from 'components/SettingsPage'
import SignInPage from 'components/SignInPage'
import TransferManaPage from 'components/TransferManaPage'
import BuyManaPage from 'components/BuyManaPage'
import BuyParcelByMortgagePage from 'components/BuyParcelByMortgagePage'
import PayMortgagePage from 'components/PayMortgagePage'
import ColorKeyPage from 'components/ColorKeyPage'
import DeleteEstatePage from 'components/DeleteEstatePage'
import TransferEstatePage from 'components/TransferEstatePage'

export default class Routes extends React.Component {
  renderRoutes() {
    return (
      <Switch>
        <Route exact path={locations.root()} component={HomePage} />
        {/*Addresses*/}
        <Route exact path={locations.profilePage()} component={ProfilePage} />
        {/*Parcels*/}
        <Route
          exact
          path={this.addLegacySupport(locations.parcelDetail())}
          component={ParcelDetailPage}
        />
        <Route
          exact
          path={this.addLegacySupport(locations.sellParcel())}
          component={PublishParcelPage}
        />
        <Route
          exact
          path={this.addLegacySupport(locations.editParcel())}
          component={EditParcelPage}
        />
        <Route
          exact
          path={this.addLegacySupport(locations.transferParcel())}
          component={TransferParcelPage}
        />
        <Route
          exact
          path={this.addLegacySupport(locations.manageParcel())}
          component={ManageParcelPage}
        />
        <Route
          exact
          path={this.addLegacySupport(locations.buyParcel())}
          component={BuyParcelPage}
        />
        <Route
          exact
          path={this.addLegacySupport(locations.cancelSaleParcel())}
          component={CancelSaleParcelPage}
        />
        <Route
          exact
          path={this.addLegacySupport(locations.parcelMapDetail())}
          component={AtlasPage}
        />

        {/*Estates*/}
        <Route
          exact
          path={locations.createEstate()}
          component={EstateDetailPage}
        />
        <Route
          exact
          path={locations.estateDetail()}
          component={EstateDetailPage}
        />
        <Route
          exact
          path={locations.editEstateParcels()}
          component={props => (
            <EstateDetailPage isSelecting={true} isEditing={true} {...props} />
          )}
        />
        <Route
          exact
          path={locations.editEstateMetadata()}
          component={props => (
            <EstateDetailPage isSelecting={false} isEditing={true} {...props} />
          )}
        />
        <Route
          exact
          path={locations.deleteEstate()}
          component={DeleteEstatePage}
        />
        <Route
          exact
          path={locations.transferEstate()}
          component={TransferEstatePage}
        />
        <Route
          exact
          path={locations.sellEstate()}
          component={PublishEstatePage}
        />
        <Route exact path={locations.buyEstate()} component={BuyEstatePage} />
        <Route
          exact
          path={locations.cancelSaleEstate()}
          component={CancelSaleEstatePage}
        />

        {/*Mortgages*/}
        {isFeatureEnabled('MORTGAGES') && (
          <Route
            exact
            path={locations.buyParcelByMortgage()}
            component={BuyParcelByMortgagePage}
          />
        )}
        {isFeatureEnabled('MORTGAGES') && (
          <Route
            exact
            path={locations.payMortgageParcel()}
            component={PayMortgagePage}
          />
        )}
        {/*General routes*/}
        <Route
          exact
          path={locations.marketplace()}
          component={MarketplacePage}
        />
        <Route exact path={locations.buyMana()} component={BuyManaPage} />
        <Route
          exact
          path={locations.transferMana()}
          component={TransferManaPage}
        />
        <Route exact path={locations.settings()} component={SettingsPage} />
        <Route exact path={locations.activity()} component={ActivityPage} />
        <Route exact path={locations.colorKey()} component={ColorKeyPage} />
        <Route exact path={locations.signIn()} component={SignInPage} />
        <Redirect to={locations.root()} />
      </Switch>
    )
  }

  addLegacySupport(path) {
    return path.replace('/parcels', '(/parcels)?')
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
