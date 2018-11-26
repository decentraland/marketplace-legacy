import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { isFeatureEnabled } from 'lib/featureUtils'
import { locations } from 'locations'

import Intercom from 'components/Intercom'
import Modal from 'components/Modal'
import Page from 'components/Page'

import HomePage from 'components/HomePage'
import AtlasPage from 'components/AtlasPage'
import MarketplacePage from 'components/MarketplacePage'
import AuctionPage from 'components/AuctionPage'
import ProfilePage from 'components/ProfilePage'
import PublishParcelPage from 'components/PublishParcelPage'
import PublishEstatePage from 'components/PublishEstatePage'
import EditParcelPage from 'components/EditParcelPage'
import TransferParcelPage from 'components/TransferParcelPage'
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
import AssetDetailPage from 'components/AssetDetailPage'
import EditEstatePage from 'components/EditEstatePage'
import ManageEstatePage from 'components/ManageEstatePage'
import AuctionFinishedPage from 'components/AuctionFinishedPage'
import { hasAuctionFinished } from 'modules/auction/utils'
import { ASSET_TYPES } from './shared/asset'

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
          render={props => (
            <AssetDetailPage assetType={ASSET_TYPES.parcel} {...props} />
          )}
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
          component={EditEstatePage}
        />
        <Route
          exact
          path={locations.estateDetail()}
          render={props => (
            <AssetDetailPage assetType={ASSET_TYPES.estate} {...props} />
          )}
        />
        <Route
          exact
          path={locations.editEstateParcels()}
          component={EditEstatePage}
        />
        <Route
          exact
          path={locations.editEstateMetadata()}
          render={props => <EditEstatePage isSelecting={false} {...props} />}
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
        <Route
          exact
          path={locations.manageEstate()}
          component={ManageEstatePage}
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

        {/*Auction*/}
        {isFeatureEnabled('AUCTION') && (
          <Route
            exact
            path={locations.auction()}
            component={hasAuctionFinished() ? AuctionFinishedPage : AuctionPage}
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
      <React.Fragment>
        <Page>{this.renderRoutes()}</Page>
        <Modal />
        <Intercom />
      </React.Fragment>
    )
  }
}
