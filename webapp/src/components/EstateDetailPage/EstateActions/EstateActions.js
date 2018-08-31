import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'

import { locations } from 'locations'
import { t } from 'modules/translation/utils'
import './EstateActions.css'

export default class EstateActions extends React.PureComponent {
  static propTypes = {
    onEditMetadata: PropTypes.func.isRequired,
    tokenId: PropTypes.string.isRequired
  }

  render() {
    const { onEditMetadata, tokenId } = this.props

    return (
      <div className="EstateActions">
        <div>
          <Button size="tiny" className="link" onClick={onEditMetadata}>
            <Icon name="pencil" />
            {t('global.edit')}
          </Button>
        </div>
        <div>
          <Link to={locations.transferEstatePage(tokenId)}>
            <Button size="tiny">
              <Icon name="exchange" />
              {t('parcel_detail.actions.transfer')}
            </Button>
          </Link>
        </div>
      </div>
    )
  }
}
