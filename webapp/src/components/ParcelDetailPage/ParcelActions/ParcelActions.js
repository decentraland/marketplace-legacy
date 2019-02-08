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
  mortgageType,
  bidType
} from 'components/types'
import { isLegacyPublication } from 'modules/publication/utils'
import { getOpenPublication } from 'shared/asset'
import { hasParcelsConnected, isListable } from 'shared/parcel'

import './ParcelActions.css'

export default class ParcelActions extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    isOwner: PropTypes.bool,
    mortgage: mortgageType,
    bids: PropTypes.arrayOf(bidType),
    publications: PropTypes.objectOf(publicationType).isRequired,
    isLoading: PropTypes.bool.isRequired
  }

  canCreateEstate = isOnSale => {
    const { wallet, parcel } = this.props
    return hasParcelsConnected(parcel, wallet.parcelsById) && !isOnSale
  }

  render() {
    const {
      wallet,
      parcel,
      isOwner,
      mortgage,
      isLoading,
      publications,
      bids
    } = this.props

    if (!parcel || isLoading) {
      return null
    }
    const { x, y } = parcel
    const publication = getOpenPublication(parcel, publications)
    const isOnSale = publication != null

    return (
      <div className="ParcelActions">
        {isOwner ? (
          <React.Fragment>
            <Link to={locations.transferParcel(x, y)}>
              <Button size="tiny">
                <Icon name="exchange" />
                {t('asset_detail.actions.transfer')}
              </Button>
            </Link>
            {this.canCreateEstate(isOnSale) && (
              <Link to={locations.createEstate(x, y)}>
                <Button size="tiny">
                  <Icon name="object group" />
                  {t('parcel_detail.actions.create_estate')}
                </Button>
              </Link>
            ) /* Estate Feature */}
            <Link to={locations.sellParcel(x, y)}>
              <Button size="tiny" primary={!isOnSale}>
                <Icon name="tag" />
                {isOnSale
                  ? t('asset_detail.actions.update_price')
                  : t('asset_detail.actions.sell')}
              </Button>
            </Link>
            {isOnSale && (
              <Link to={locations.cancelSaleParcel(x, y)}>
                <Button size="tiny" primary>
                  <Icon name="cancel" />
                  {t('asset_detail.actions.cancel')}
                </Button>
              </Link>
            )}
          </React.Fragment>
        ) : isOnSale && !mortgage ? (
          <React.Fragment>
            <Link to={locations.buyParcel(x, y)}>
              <Button primary size="large">
                {t('asset_detail.publication.buy')}
              </Button>
            </Link>
            {wallet.address &&
              !isLegacyPublication(publication) && (
                <Link to={locations.buyParcelByMortgage(x, y)}>
                  <Button size="large">
                    {t('parcel_detail.publication.mortgage')}
                  </Button>
                </Link>
              )}
          </React.Fragment>
        ) : null}
        {isFeatureEnabled('BIDS') &&
          !isOwner &&
          !mortgage &&
          !bids.length &&
          isListable(parcel) && (
            <React.Fragment>
              <Link to={locations.bidParcel(x, y)}>
                <Button primary size="large">
                  {t('asset_detail.bid.place')}
                </Button>
              </Link>
            </React.Fragment>
          )}
      </div>
    )
  }
}
