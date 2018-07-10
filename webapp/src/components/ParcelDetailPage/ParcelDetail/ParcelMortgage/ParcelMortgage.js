import React from 'react'
import { Grid } from 'semantic-ui-react'

import Mana from 'components/Mana'
import MortgageActions from 'components/MortgageActions'
import Expiration from 'components/Expiration'
import { t } from 'modules/translation/utils'
import { mortgageType } from 'components/types'
import {
  isMortgagePending,
  isMortgageOngoing,
  isMortgagePaid
} from 'shared/mortgage'

import './ParcelMortgage.css'

export default class ParcelMortgage extends React.PureComponent {
  static propTypes = {
    mortgage: mortgageType
  }

  render() {
    const { mortgage } = this.props
    const startTime = Math.round(new Date(mortgage.started_at).getTime() / 1000)
    return (
      <Grid className="ParcelMortgageDetail">
        <Grid.Row>
          <Grid.Column width={2} className={mortgage.status}>
            <h3>{t('global.mortgage')}</h3>
            <p>{mortgage.status}</p>
          </Grid.Column>
          <Grid.Column width={2}>
            <h3>
              {isMortgagePending(mortgage)
                ? t('mortgage.requested')
                : t('mortgage.outstanding_amount')}
            </h3>
            <Mana
              amount={
                isMortgagePending(mortgage)
                  ? parseFloat(mortgage.amount)
                  : parseFloat(mortgage.outstanding_amount).toFixed(2)
              }
              size={20}
              scale={1.2}
              className="mortgage-amount-icon"
            />
          </Grid.Column>
          {isMortgagePending(mortgage) && (
            <Grid.Column width={3} className={'expires-at'}>
              <h3>{t('global.time_left')}</h3>
              <p>
                <Expiration expiresAt={parseInt(mortgage.expires_at, 10)} />
              </p>
            </Grid.Column>
          )}
          {isMortgageOngoing(mortgage) && (
            <React.Fragment>
              <Grid.Column width={3}>
                <h3>{t('mortgage.payable')}</h3>
                <p>
                  <Expiration
                    expiresAt={parseInt(
                      (startTime + parseInt(mortgage.payable_at, 10)) * 1000,
                      10
                    )}
                  />
                </p>
              </Grid.Column>
              <Grid.Column width={3}>
                <h3>{t('global.time_left')}</h3>
                <p>
                  <Expiration
                    expiresAt={parseInt(
                      (startTime + parseInt(mortgage.is_due_at, 10)) * 1000,
                      10
                    )}
                  />
                </p>
              </Grid.Column>
            </React.Fragment>
          )}
          {isMortgagePaid(mortgage) && (
            <Grid.Column width={3}>
              <h3>{t('global.paid_at')}</h3>
              <p>
                <Expiration
                  expiresAt={parseInt(
                    (startTime + parseInt(mortgage.block_time_updated_at, 10)) *
                      1000,
                    10
                  )}
                />
              </p>
            </Grid.Column>
          )}
          <Grid.Column width={3} className={'cta'}>
            <MortgageActions mortgage={mortgage} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
