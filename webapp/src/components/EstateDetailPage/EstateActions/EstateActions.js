import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

import { t } from 'modules/translation/utils'
import TxStatus from 'components/TxStatus'
import './EstateActions.css'

export default class EstateActions extends React.PureComponent {
  static propTypes = {
    isTxIdle: PropTypes.bool.isRequired,
    onEditMetadata: PropTypes.func.isRequired,
    onEditParcels: PropTypes.func.isRequired,
    onDeleteEstate: PropTypes.func.isRequired
  }

  render() {
    const {
      onEditMetadata,
      onEditParcels,
      onDeleteEstate,
      isTxIdle
    } = this.props

    return isTxIdle ? (
      <TxStatus.Idle isIdle={isTxIdle} />
    ) : (
      <div className="EstateActions">
        <div>
          <Button size="tiny" className="link" onClick={onEditMetadata}>
            <Icon name="pencil" />
            {t('global.edit')}
          </Button>
        </div>
        <div>
          <Button size="tiny" onClick={onEditParcels}>
            {t('estate_detail.edit_parcels')}
          </Button>
          <Button size="tiny" onClick={onDeleteEstate}>
            {t('estate_detail.delete')}
          </Button>
        </div>
      </div>
    )
  }
}
