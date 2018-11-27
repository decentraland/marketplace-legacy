import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import TxStatus from 'components/TxStatus'
import './EstateSelectActions.css'

export default class EstateSelectActions extends React.PureComponent {
  static propTypes = {
    isCreation: PropTypes.bool.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
    canContinue: PropTypes.bool.isRequired,
    canSubmit: PropTypes.bool.isRequired
  }

  render() {
    const {
      onSubmit,
      onCancel,
      onContinue,
      canContinue,
      canSubmit,
      isCreation,
      isTxIdle
    } = this.props

    return (
      <div className="EstateSelectActions">
        {isTxIdle && <TxStatus.Idle isIdle={isTxIdle} />}
        <Button size="tiny" onClick={onCancel}>
          {t('global.cancel')}
        </Button>
        <Button
          size="tiny"
          disabled={isCreation ? !canContinue : !canSubmit}
          onClick={isCreation ? onContinue : onSubmit}
          primary
        >
          {isCreation ? t('global.continue') : t('global.submit')}
        </Button>
      </div>
    )
  }
}
