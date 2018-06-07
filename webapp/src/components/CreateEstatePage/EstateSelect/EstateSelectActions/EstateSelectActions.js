import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import { t } from 'modules/translation/utils'

import './EstateSelectActions.css'

export default class EstateSelectActions extends React.PureComponent {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  }

  render() {
    const { onCancel, onContinue, disabled } = this.props
    return (
      <div className="EstateActions">
        <Button size="tiny" onClick={onCancel}>
          {t('global.cancel')}
        </Button>
        <Button size="tiny" disabled={disabled} onClick={onContinue}>
          {t('global.continue')}
        </Button>
      </div>
    )
  }
}
