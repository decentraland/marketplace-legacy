import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { locations } from 'locations'
import AddressBlock from 'components/AddressBlock'
import { walletType, estateType } from 'components/types'
import { can, ACTIONS, isOwner } from 'shared/roles'

import './EstateOwner.css'

export default class EstateOwner extends React.PureComponent {
  static propTypes = {
    wallet: walletType.isRequired,
    estate: estateType.isRequired
  }

  renderOwner() {
    const { estate } = this.props
    return (
      <span className="owned-by">
        <span>{t('global.owned_by')}</span>
        <AddressBlock address={estate.owner} scale={4} />
      </span>
    )
  }

  render() {
    const { wallet, estate } = this.props
    if (!estate) {
      return null
    }

    const canEdit = can(ACTIONS.updateMetadata, wallet.address, estate)
    const canManage = can(ACTIONS.setUpdateOperator, wallet.address, estate)

    return (
      <div className="EstateOwner">
        {canEdit ? (
          <Link to={locations.editEstateMetadata(estate.id)}>
            <Button size="tiny" className="link">
              <Icon name="pencil" />
              {t('global.edit')}
            </Button>
          </Link>
        ) : null}

        {canManage ? (
          <Link to={locations.manageEstate(estate.id)}>
            <Button size="tiny" className="link">
              <Icon name="add user" />
              {t('asset_detail.actions.permissions')}
            </Button>
          </Link>
        ) : null}

        {!isOwner(wallet.address, estate) ? this.renderOwner() : null}
      </div>
    )
  }
}
