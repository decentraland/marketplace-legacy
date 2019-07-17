import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { locations } from 'locations'
import Permission from 'components/Permission'
import {
  publicationType,
  estateType,
  bidType,
  walletType
} from 'components/types'
import { isFeatureEnabled } from 'lib/featureUtils'
import { isOnSale } from 'modules/asset/utils'
import { ACTIONS } from 'shared/roles'
import { ASSET_TYPES } from 'shared/asset'

import './EstateActions.css'

export default class EstateActions extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    publications: PropTypes.objectOf(publicationType).isRequired,
    bids: PropTypes.arrayOf(bidType),
    wallet: walletType
  }

  render() {
    const { estate, publications, bids, wallet } = this.props
    const { id } = estate

    return (
      <div className="EstateActions">
        {isFeatureEnabled('BIDS') && (
          <Permission
            asset={estate}
            assetType={ASSET_TYPES.estate}
            actions={[ACTIONS.bid]}
          >
            <Link to={locations.bidEstate(id)}>
              <Button size="large">{t('asset_detail.bid.place')}</Button>
            </Link>
          </Permission>
        )}

        <Permission
          asset={estate}
          assetType={ASSET_TYPES.estate}
          actions={[ACTIONS.transfer]}
        >
          <Link to={locations.transferEstate(id)}>
            <Button size="tiny">
              <Icon name="exchange" />
              {t('asset_detail.actions.transfer')}
            </Button>
          </Link>
        </Permission>

        <Permission
          asset={estate}
          assetType={ASSET_TYPES.estate}
          actions={[ACTIONS.sell]}
        >
          <Link to={locations.sellEstate(id)}>
            <Button size="tiny" primary={!isOnSale(estate, publications)}>
              <Icon name="tag" />
              {isOnSale(estate, publications)
                ? t('asset_detail.actions.update_price')
                : t('asset_detail.actions.sell')}
            </Button>
          </Link>
        </Permission>

        <Permission
          asset={estate}
          assetType={ASSET_TYPES.estate}
          actions={[ACTIONS.cancelSale]}
        >
          <Link to={locations.cancelSaleEstate(id)}>
            <Button size="tiny" primary>
              <Icon name="cancel" />
              {t('asset_detail.actions.cancel')}
            </Button>
          </Link>
        </Permission>

        <Permission
          asset={estate}
          assetType={ASSET_TYPES.estate}
          actions={[ACTIONS.buy]}
        >
          <Link to={locations.buyEstate(id)}>
            <Button primary size="large">
              {t('asset_detail.publication.buy')}
            </Button>
          </Link>
        </Permission>
      </div>
    )
  }
}
