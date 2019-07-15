import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { locations } from 'locations'
import { isFeatureEnabled } from 'lib/featureUtils'
import {
  parcelType,
  publicationType,
  bidType,
  walletType
} from 'components/types'
import { isOnSale } from 'modules/asset/utils'
import { can, ACTIONS } from 'modules/permission/utils'

import './ParcelActions.css'

export default class ParcelActions extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    hasMortgage: PropTypes.bool,
    bids: PropTypes.arrayOf(bidType),
    publications: PropTypes.objectOf(publicationType).isRequired,
    isLoading: PropTypes.bool.isRequired,
    wallet: walletType
  }

  render() {
    const {
      wallet,
      parcel,
      hasMortgage,
      isLoading,
      publications,
      bids
    } = this.props

    if (!parcel || isLoading) {
      return null
    }

    const { x, y } = parcel
    const isListed = isOnSale(parcel, publications)

    return (
      <div className="ParcelActions">
        {can(ACTIONS.transfer, wallet, parcel) && (
          <Link to={locations.transferParcel(x, y)}>
            <Button size="tiny">
              <Icon name="exchange" />
              {t('asset_detail.actions.transfer')}
            </Button>
          </Link>
        )}

        {can(ACTIONS.canCreateEstate, wallet, parcel) && (
          <Link to={locations.createEstate(x, y)}>
            <Button size="tiny">
              <Icon name="object group" />
              {t('parcel_detail.actions.create_estate')}
            </Button>
          </Link>
        )}

        {can(ACTIONS.sell, wallet, parcel) && (
          <Link to={locations.sellParcel(x, y)}>
            <Button size="tiny" primary={!isListed}>
              <Icon name="tag" />
              {isListed
                ? t('asset_detail.actions.update_price')
                : t('asset_detail.actions.sell')}
            </Button>
          </Link>
        )}

        {can(ACTIONS.cancelSale, wallet, parcel) && (
          <Link to={locations.cancelSaleParcel(x, y)}>
            <Button size="tiny" primary>
              <Icon name="cancel" />
              {t('asset_detail.actions.cancel')}
            </Button>
          </Link>
        )}

        {hasMortgage ? null : (
          <React.Fragment>
            {can(ACTIONS.getMortgage, wallet, parcel) && (
              <Link to={locations.buyParcelByMortgage(x, y)}>
                <Button size="large">
                  {t('parcel_detail.publication.mortgage')}
                </Button>
              </Link>
            )}

            {isFeatureEnabled('BIDS') &&
              can(ACTIONS.bid, wallet, parcel) && (
                <Link to={locations.bidParcel(x, y)}>
                  <Button size="large">{t('asset_detail.bid.place')}</Button>
                </Link>
              )}

            {can(ACTIONS.buy, wallet, parcel) && (
              <Link to={locations.buyParcel(x, y)}>
                <Button primary size="large">
                  {t('asset_detail.publication.buy')}
                </Button>
              </Link>
            )}
          </React.Fragment>
        )}
      </div>
    )
  }
}
