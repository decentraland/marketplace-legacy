import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'semantic-ui-react'
import TxStatus from 'components/TxStatus'
import { preventDefault } from 'lib/utils'
import { t } from 'modules/translation/utils'

import './CancelSaleForm.css'

export default class CancelSaleForm extends React.PureComponent {
  static propTypes = {
    isTxIdle: PropTypes.bool,
    isDisabled: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const { isTxIdle, isDisabled, onCancel, onConfirm } = this.props

    return (
      <Form className="CancelSaleForm" onSubmit={preventDefault(onConfirm)}>
        <TxStatus.Idle isIdle={isTxIdle} />
        <br />
        <div>
          <Button onClick={onCancel} type="button">
            {t('global.cancel')}
          </Button>
          <Button
            type="submit"
            primary={true}
            disabled={isTxIdle || isDisabled}
          >
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
