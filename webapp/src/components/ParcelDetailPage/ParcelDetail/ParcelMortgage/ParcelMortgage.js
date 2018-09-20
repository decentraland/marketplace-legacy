import React from 'react'
import { Grid } from 'semantic-ui-react'

import Mana from 'components/Mana'
import MortgageActions from 'components/MortgageActions'
import Expiration from 'components/Expiration'
import { mortgageType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import {
  isMortgagePending,
  isMortgageOngoing,
  isMortgagePaid,
  isMortgageDefaulting,
  isMortgageDefaulted,
  getMortgageOutstandingAmount,
  getMortgageTimeLeft,
  getMortgageStatus
} from 'shared/mortgage'
import { distanceInWordsToNow } from 'lib/utils'

import './ParcelMortgage.css'

export default class ParcelMortgage extends React.PureComponent {
  static propTypes = {
    mortgage: mortgageType
  }

  render() {
    const { mortgage } = this.props

    return (
      <Grid className={`ParcelMortgageDetail ${getMortgageStatus(mortgage)}`}>
        <Grid.Row>
          <Grid.Column width={2} className={getMortgageStatus(mortgage)}>
            <h3>{t('global.mortgage')}</h3>
            <p>{getMortgageStatus(mortgage)}</p>
          </Grid.Column>
          {!isMortgageDefaulted(mortgage) && (
            <React.Fragment>
              {!isMortgagePaid(mortgage) && (
                <Grid.Column width={isMortgageOngoing(mortgage) ? 4 : 2}>
                  <h3>
                    {isMortgagePending(mortgage)
                      ? t('mortgage.requested')
                      : t('mortgage.outstanding_amount')}
                  </h3>
                  <Mana
                    amount={
                      isMortgagePending(mortgage)
                        ? parseFloat(mortgage.amount)
                        : getMortgageOutstandingAmount(mortgage)
                    }
                    size={20}
                    scale={1.2}
                    className="mortgage-amount-icon"
                  />
                </Grid.Column>
              )}
              {isMortgagePending(mortgage) && (
                <Grid.Column width={4} className={'expires-at'}>
                  <h3>{t('global.time_left')}</h3>
                  <p>
                    <Expiration expiresAt={parseInt(mortgage.expires_at, 10)} />
                  </p>
                </Grid.Column>
              )}
              {isMortgageOngoing(mortgage) && (
                <React.Fragment>
                  <Grid.Column width={4}>
                    <h3>
                      {isMortgageDefaulting(mortgage)
                        ? t('mortgage.defaulted_in')
                        : t('global.time_left')}
                    </h3>
                    <p>{distanceInWordsToNow(getMortgageTimeLeft(mortgage))}</p>
                  </Grid.Column>
                </React.Fragment>
              )}
              {isMortgagePaid(mortgage) && (
                <Grid.Column width={6}>
                  <h3>{t('global.paid_at')}</h3>
                  <p>
                    {distanceInWordsToNow(
                      parseInt(mortgage.block_time_updated_at, 10)
                    )}
                  </p>
                </Grid.Column>
              )}
              <Grid.Column width={3} className={'cta'}>
                <MortgageActions mortgage={mortgage} />
              </Grid.Column>
            </React.Fragment>
          )}
        </Grid.Row>
      </Grid>
    )
  }
}
