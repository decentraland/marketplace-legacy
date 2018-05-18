import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'
import { parcelType } from 'components/types'
import { t } from 'modules/translation/utils'
import { isOnSale } from 'lib/parcelUtils'
import { locations } from 'locations'

import './ParcelActions.css'

export default class ParcelActions extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    isOwner: PropTypes.bool
  }

  render() {
    const { parcel, isOwner } = this.props
    if (!parcel) {
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
            {isOnSale(parcel) ? (
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
        ) : isOnSale(parcel) ? (
          <Link to={locations.buyLand(x, y)}>
            <Button primary size="large">
              {t('parcel_detail.publication.buy')}
            </Button>
          </Link>
        ) : null}
      </div>
    )
  }
}
