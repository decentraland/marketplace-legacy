import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'
import { MORTGAGE_STATUS } from 'shared/mortgage'

import { t } from 'modules/translation/utils'

export default class MortgageActions extends React.PureComponent {
  static propTypes = {
    mortgage: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
  }
  render() {
    const { mortgage, onCancel } = this.props

    return mortgage.status === MORTGAGE_STATUS.open ? (
      <Button size="tiny" onClick={onCancel}>
        {t('mortgage.cancel')}
      </Button>
    ) : null
  }
}
