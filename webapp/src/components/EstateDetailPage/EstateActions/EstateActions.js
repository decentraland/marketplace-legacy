import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'

import { locations } from 'locations'
import { isOnSale } from 'shared/asset'
import { isListable } from 'shared/listing'
import { isFeatureEnabled } from 'lib/featureUtils'
import { t } from '@dapps/modules/translation/utils'
import { publicationType, estateType, bidType } from 'components/types'

import './EstateActions.css'

export default class EstateActions extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    publications: PropTypes.objectOf(publicationType).isRequired,
    bids: PropTypes.arrayOf(bidType)
  }

  render() {
    const { estate, publications, isOwner, bids } = this.props
    const { id } = estate
    const isListed = isOnSale(estate, publications)

    return (
      <div className="EstateActions">
        {isOwner ? (
          <React.Fragment>
            <Link to={locations.transferEstate(id)}>
              <Button size="tiny">
                <Icon name="exchange" />
                {t('asset_detail.actions.transfer')}
              </Button>
            </Link>
            <Link to={locations.sellEstate(id)}>
              <Button size="tiny" primary={!isListed}>
                <Icon name="tag" />
                {isListed
                  ? t('asset_detail.actions.update_price')
                  : t('asset_detail.actions.sell')}
              </Button>
            </Link>
            {isListed && (
              <Link to={locations.cancelSaleEstate(id)}>
                <Button size="tiny" primary>
                  <Icon name="cancel" />
                  {t('asset_detail.actions.cancel')}
                </Button>
              </Link>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {isOnSale(estate, publications) && (
              <Link to={locations.buyEstate(id)}>
                <Button primary size="large">
                  {t('asset_detail.publication.buy')}
                </Button>
              </Link>
            )}
            {isFeatureEnabled('BIDS') &&
              isListable(estate) &&
              bids.length === 0 && (
                <Link to={locations.bidEstate(id)}>
                  <Button primary size="large">
                    {t('asset_detail.bid.place')}
                  </Button>
                </Link>
              )}
          </React.Fragment>
        )}
      </div>
    )
  }
}
