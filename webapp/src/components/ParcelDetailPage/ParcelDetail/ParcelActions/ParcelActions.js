import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'

import { locations } from 'locations'
import { parcelType, publicationType, mortgageType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import { getOpenPublication } from 'shared/asset'
import { hasParcelsConnected } from 'shared/parcel'
import { isFeatureEnabled } from 'lib/featureUtils'
import { isLegacyPublication } from 'modules/publication/utils'

import './ParcelActions.css'

export default class ParcelActions extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    isOwner: PropTypes.bool,
    mortgage: mortgageType,
    publications: PropTypes.objectOf(publicationType).isRequired,
    isLoading: PropTypes.bool.isRequired
  }

  canCreateEstate = () => {
    const { wallet, parcel } = this.props
    return hasParcelsConnected(parcel, wallet.parcelsById)
  }

  render() {
    const {
      wallet,
      parcel,
      isOwner,
      mortgage,
      isLoading,
      publications
    } = this.props
    if (!parcel || isLoading) {
      return null
    }
    const { x, y } = parcel
    const publication = getOpenPublication(parcel, publications)
    const isOnSale = !!publication

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
            {this.canCreateEstate() && (
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
            {isFeatureEnabled('MORTGAGES') &&
              wallet.address &&
              !isLegacyPublication(publication) && (
                <Link to={locations.buyParcelByMortgage(x, y)}>
                  <Button size="large">
                    {t('parcel_detail.publication.mortgage')}
                  </Button>
                </Link>
              ) /* Mortgage Feature */}
          </React.Fragment>
        ) : null}
      </div>
    )
  }
}
