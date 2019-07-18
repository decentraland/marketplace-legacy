import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { locations } from 'locations'
import Permission from 'components/Permission'
import {
  parcelType,
  publicationType,
  bidType,
  walletType
} from 'components/types'
import { isOnSale } from 'modules/asset/utils'
import { isFeatureEnabled } from 'lib/featureUtils'
import { ACTIONS } from 'shared/roles'
import { ASSET_TYPES } from 'shared/asset'

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

    return (
      <div className="ParcelActions">
        <Permission
          asset={parcel}
          assetType={ASSET_TYPES.parcel}
          actions={[ACTIONS.transfer]}
        >
          <Link to={locations.transferParcel(x, y)}>
            <Button size="tiny">
              <Icon name="exchange" />
              {t('asset_detail.actions.transfer')}
            </Button>
          </Link>
        </Permission>

        <Permission
          asset={parcel}
          assetType={ASSET_TYPES.parcel}
          actions={[ACTIONS.createEstate]}
        >
          <Link to={locations.createEstate(x, y)}>
            <Button size="tiny">
              <Icon name="object group" />
              {t('parcel_detail.actions.create_estate')}
            </Button>
          </Link>
        </Permission>

        <Permission
          asset={parcel}
          assetType={ASSET_TYPES.parcel}
          actions={[ACTIONS.sell]}
        >
          <Link to={locations.sellParcel(x, y)}>
            <Button size="tiny" primary={!isOnSale(parcel, publications)}>
              <Icon name="tag" />
              {isOnSale(parcel, publications)
                ? t('asset_detail.actions.update_price')
                : t('asset_detail.actions.sell')}
            </Button>
          </Link>
        </Permission>

        <Permission
          asset={parcel}
          assetType={ASSET_TYPES.parcel}
          actions={[ACTIONS.cancelSale]}
        >
          <Link to={locations.cancelParcelSale(x, y)}>
            <Button size="tiny" primary>
              <Icon name="cancel" />
              {t('asset_detail.actions.cancel')}
            </Button>
          </Link>
        </Permission>

        {hasMortgage ? null : (
          <React.Fragment>
            <Permission
              asset={parcel}
              assetType={ASSET_TYPES.parcel}
              actions={[ACTIONS.getMortgage]}
            >
              <Link to={locations.buyParcelByMortgage(x, y)}>
                <Button size="large">
                  {t('parcel_detail.publication.mortgage')}
                </Button>
              </Link>
            </Permission>

            {isFeatureEnabled('BIDS') && (
              <Permission
                asset={parcel}
                assetType={ASSET_TYPES.parcel}
                actions={[ACTIONS.bid]}
              >
                <Link to={locations.bidParcel(x, y)}>
                  <Button size="large">{t('asset_detail.bid.place')}</Button>
                </Link>
              </Permission>
            )}

            <Permission
              asset={parcel}
              assetType={ASSET_TYPES.parcel}
              actions={[ACTIONS.buy]}
            >
              <Link to={locations.buyParcel(x, y)}>
                <Button primary size="large">
                  {t('asset_detail.publication.buy')}
                </Button>
              </Link>
            </Permission>
          </React.Fragment>
        )}
      </div>
    )
  }
}
