import React from 'react'
import { t } from '@dapps/modules/translation/utils'
import './NotFound.css'

export default class NotFound extends React.PureComponent {
  render() {
    return (
      <div className="NotFound">
        <div className="message">{t('marketplace.empty')}</div>
      </div>
    )
  }
}
