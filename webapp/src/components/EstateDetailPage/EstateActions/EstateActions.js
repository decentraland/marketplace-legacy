import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'

import { locations } from 'locations'
import { t } from '@dapps/modules/translation/utils'
import './EstateActions.css'

export default class EstateActions extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onEditMetadata: PropTypes.func.isRequired
  }

  render() {
    const { id, onEditMetadata } = this.props

    return (
      <div className="EstateActions">
        <div>
          <Button size="tiny" className="link" onClick={onEditMetadata}>
            <Icon name="pencil" />
            {t('global.edit')}
          </Button>
        </div>
        <div>
          <Link to={locations.transferEstate(id)}>
            <Button size="tiny">
              <Icon name="exchange" />
              {t('parcel_detail.actions.transfer')}
            </Button>
          </Link>

          <Link to={locations.sellEstate(id)}>
            <Button size="tiny">
              <Icon name="exchange" />
              {t('parcel_detail.actions.sell')}
            </Button>
          </Link>
        </div>
      </div>
    )
  }
}
