import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import { t } from 'modules/translation/utils'
import { MORTGAGE_STATUS } from 'modules/mortgage/utils'
import { mortgageType } from 'components/types'

export default class MortgageActions extends React.PureComponent {
  static propTypes = {
    mortgage: mortgageType,
    onCancel: PropTypes.func.isRequired,
    onPay: PropTypes.func.isRequired,
    onClaim: PropTypes.func.isRequired
  }
  render() {
    const { mortgage, onCancel, onPay, onClaim } = this.props

    switch (mortgage.status) {
      case MORTGAGE_STATUS.pending:
        return (
          <Button size="tiny" onClick={onCancel}>
            {t('mortgage.cancel')}
          </Button>
        )
      case MORTGAGE_STATUS.ongoing:
      case MORTGAGE_STATUS.defaulted:
        return (
          <Button size="tiny" onClick={onPay}>
            {t('mortgage.pay')}
          </Button>
        )
      case MORTGAGE_STATUS.paid:
        return (
          <Button size="tiny" onClick={onClaim}>
            {t('mortgage.claim')}
          </Button>
        )
      default:
        return null
    }
  }
}
