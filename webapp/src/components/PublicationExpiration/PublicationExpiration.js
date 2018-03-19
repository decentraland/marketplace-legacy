import React from 'react'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import differenceInDays from 'date-fns/difference_in_days'

import { publicationType } from 'components/types'
import { isExpired } from 'modules/publication/utils'
import { t } from 'modules/translation/utils'

const MAX_PUBLICATION_EXPIRES = 10 * 365

export default class PublicationExpiration extends React.PureComponent {
  static propTypes = {
    publication: publicationType
  }

  render() {
    const { publication } = this.props

    const difference = differenceInDays(publication.expires_at, new Date())
    const expirationTimeInWords = distanceInWordsToNow(publication.expires_at)

    return (
      <span className="PublicationExpiration">
        {isExpired(publication)
          ? t('publication.expired_at', { time: expirationTimeInWords })
          : !difference || difference >= MAX_PUBLICATION_EXPIRES
            ? t('publication.expires_in_more_than_years', {
                years: MAX_PUBLICATION_EXPIRES / 365
              })
            : t('publication.expires_in', { time: expirationTimeInWords })}
      </span>
    )
  }
}
