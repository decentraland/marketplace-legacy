import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import { t } from 'modules/translation/utils'
import { MORTGAGE_STATUS } from 'modules/mortgage/utils'

export default class MortgageActions extends React.PureComponent {
  static propTypes = {
    mortgage: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
  }
  render() {
    const { mortgage, onCancel } = this.props

    switch (mortgage.status) {
      case MORTGAGE_STATUS.pending:
        return <Button size="tiny" onClick={onCancel}>
            {t('mortgage.cancel')}
          </Button>
      case MORTGAGE_STATUS.ongoing:
      case MORTGAGE_STATUS.defaulted:
        return <Button size="tiny">
          {t('mortgage.pay')}
        </Button>
      default:
       return null
    }
  }
}
