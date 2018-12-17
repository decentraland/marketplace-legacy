import React from 'react'
import { PropTypes } from 'prop-types'
import { Button } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import StaticPage from 'components/StaticPage'
import WalletIcon from './WalletIcon'

import './SignInNotice.css'

export default class SignInNotice extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    children: PropTypes.node,
    onConnect: PropTypes.func.isRequired
  }

  handleConnect = () => {
    this.props.onConnect()
  }

  render() {
    const { title, message, children } = this.props

    return (
      <StaticPage className="SignInNotice">
        <div className="message">
          <WalletIcon />
          <h1>{title || t('sign_in.get_started')}</h1>
          {children ? (
            children
          ) : (
            <p>{message || t('sign_in_notice.message')}</p>
          )}

          <Button type="button" primary onClick={this.handleConnect}>
            {t('global.connect')}
          </Button>
        </div>
      </StaticPage>
    )
  }
}
