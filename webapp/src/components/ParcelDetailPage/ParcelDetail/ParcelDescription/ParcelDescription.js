import React from 'react'
import PropTypes from 'prop-types'

import { t } from 'modules/translation/utils'

export default class ParcelDescription extends React.PureComponent {
  static propTypes = {
    description: PropTypes.string.isRequired
  }

  render() {
    const { description } = this.props

    const className =
      'parcel-description' + (description ? '' : ' parcel-description-empty')

    return (
      <div>
        <h3>{t('parcel_detail.description')}</h3>
        <p className={className}>
          {description || t('parcel_detail.empty_description')}
        </p>
      </div>
    )
  }
}
