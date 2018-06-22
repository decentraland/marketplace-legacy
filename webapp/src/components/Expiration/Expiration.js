import React from 'react'
import PropTypes from 'prop-types'
import differenceInDays from 'date-fns/difference_in_days'

import { distanceInWordsToNow } from 'lib/utils'
import { isExpired } from 'shared/utils'
import { t } from 'modules/translation/utils'

const MAX_EXPIRES = 10 * 365

export default class Expiration extends React.PureComponent {
  static propTypes = {
    expiresAt: PropTypes.number.isRequired,
    className: PropTypes.string
  }
  render() {
    const expiresAt = parseInt(this.props.expiresAt, 10)
    const difference = differenceInDays(expiresAt, new Date())
    const expirationTimeInWords = distanceInWordsToNow(expiresAt)

    return (
      <span className={this.props.className}>
        {isExpired(expiresAt)
          ? t('global.expired_at', { time: expirationTimeInWords })
          : isNaN(difference) || difference >= MAX_EXPIRES
            ? t('global.expires_in_more_than_years', {
                years: MAX_EXPIRES / 365
              })
            : t('global.expires_in', { time: expirationTimeInWords })}
      </span>
    )
  }
}
