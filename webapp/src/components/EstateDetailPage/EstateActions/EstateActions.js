import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

import { t } from 'modules/translation/utils'
import './EstateActions.css'

export default class EstateActions extends React.PureComponent {
  static propTypes = {
    onEditMetadata: PropTypes.func.isRequired
  }

  render() {
    const { onEditMetadata } = this.props

    return (
      <div className="EstateActions">
        <Button size="tiny" className="link" onClick={onEditMetadata}>
          <Icon name="pencil" />
          {t('global.edit')}
        </Button>
      </div>
    )
  }
}
