import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'

import { locations } from 'locations'
import { isOnSale } from 'shared/asset'
import { t } from '@dapps/modules/translation/utils'
import { publicationType, estateType } from 'components/types'
import './EstateActions.css'

export default class EstateActions extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    publications: PropTypes.objectOf(publicationType).isRequired
  }

  render() {
    const { estate, publications, isOwner } = this.props
    const { id } = estate

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
            {isOnSale(estate, publications) ? (
              <Link to={locations.cancelSaleEstate(id)}>
                <Button size="tiny" primary>
                  <Icon name="cancel" />
                  {t('asset_detail.actions.cancel')}
                </Button>
              </Link>
            ) : (
              <Link to={locations.sellEstate(id)}>
                <Button size="tiny">
                  <Icon name="tag" />
                  {t('asset_detail.actions.sell')}
                </Button>
              </Link>
            )}
          </React.Fragment>
        ) : (
          isOnSale(estate, publications) && (
            <Link to={locations.buyEstate(id)}>
              <Button primary size="large">
                {t('asset_detail.publication.buy')}
              </Button>
            </Link>
          )
        )}
      </div>
    )
  }
}
