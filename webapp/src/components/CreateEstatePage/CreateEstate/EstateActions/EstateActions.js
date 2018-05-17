import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import { parcelType } from 'components/types'
import { t } from 'modules/translation/utils'
import { locations } from 'locations'

import './EstateActions.css'

export default class EstateActions extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired
  }

  render() {
    return (
      <div className="EstateActions">
        <Link to={locations.root}>
          <Button size="tiny">{t('cancel')}</Button>
        </Link>
        <Link to={locations.root}>
          <Button size="tiny">{t('continue')}</Button>
        </Link>
      </div>
    )
  }
}
