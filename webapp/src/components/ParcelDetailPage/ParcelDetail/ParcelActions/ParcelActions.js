import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'

import { isFeatureEnabled } from 'lib/featureUtils'
import { parcelType, publicationType, mortgageType } from 'components/types'
import { t } from 'modules/translation/utils'
import { isOnSale } from 'shared/parcel'
import { locations } from 'locations'

import './ParcelActions.css'

export default class ParcelActions extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    isOwner: PropTypes.bool,
    mortgage: mortgageType,
    publications: PropTypes.objectOf(publicationType).isRequired,
    isLoading: PropTypes.bool.isRequired
  }

  render() {
    const { parcel, isOwner, mortgage, isLoading, publications } = this.props
    if (!parcel || isLoading) {
      return null
    }
    const { x, y } = parcel
    return (
      <div className="ParcelActions">
        {isOwner ? (
          <React.Fragment>
            <Link to={locations.transferLand(x, y)}>
              <Button size="tiny">
                <Icon name="exchange" />
                {t('parcel_detail.actions.transfer')}
              </Button>
            </Link>

            {isFeatureEnabled('ESTATES') && (
              <Link to={locations.createEstateLand(x, y)}>
                <Button size="tiny">
                  {t('parcel_detail.actions.create_estate')}
                </Button>
              </Link>
            ) /* Estate Feature */}
            {isOnSale(parcel, publications) ? (
              <Link to={locations.cancelSaleLand(x, y)}>
                <Button size="tiny" primary>
                  <Icon name="cancel" />
                  {t('parcel_detail.actions.cancel')}
                </Button>
              </Link>
            ) : (
              <Link to={locations.sellLand(x, y)}>
                <Button size="tiny" primary>
                  <Icon name="tag" />
                  {t('parcel_detail.actions.sell')}
                </Button>
              </Link>
            )}
          </React.Fragment>
        ) : isOnSale(parcel, publications) && !mortgage ? (
          <React.Fragment>
            <Link to={locations.buyLand(x, y)}>
              <Button primary size="large">
                {t('parcel_detail.publication.buy')}
              </Button>
            </Link>
            {isFeatureEnabled('MORTGAGES') && (
              <Link to={locations.buyLandByMortgage(x, y)}>
                <Button primary size="large">
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
