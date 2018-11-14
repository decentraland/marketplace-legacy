import React from 'react'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { t, T } from '@dapps/modules/translation/utils'

import './SignInNotice.css'

export default class SignInNotice extends React.PureComponent {
  render() {
    return (
      <p className="SignInNotice">
        <T
          id="global.sign_in_notice"
          values={{
            sign_in_link: (
              <Link to={locations.signIn()}>{t('global.sign_in')}</Link>
            )
          }}
        />
      </p>
    )
  }
}
