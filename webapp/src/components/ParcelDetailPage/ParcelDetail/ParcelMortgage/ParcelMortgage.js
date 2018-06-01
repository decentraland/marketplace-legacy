import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'semantic-ui-react'

import Mana from 'components/Mana'
import MortgageActions from 'components/MortgageActions'
import Expiration from 'components/Expiration'
import { t } from 'modules/translation/utils'

import './ParcelMortgage.css'
import { isMortgagePending, isMortgageOngoing } from 'modules/mortgage/utils'

export default class ParcelMortgage extends React.PureComponent {
  static propTypes = {
    mortgages: PropTypes.array.isRequired
  }

  render() {
    const { mortgages } = this.props
    return (
      <Grid className="parcelMortgageDetail">
        {mortgages.map(mortgage => {
          const startTime = Math.round(
            new Date(mortgage.started_at).getTime() / 1000
          )

          return (
            <Grid.Row key={mortgage.mortgage_id}>
              <Grid.Column width={2} className={mortgage.status}>
                <h3>{t('global.mortgage')}</h3>
                <p>{mortgage.status}</p>
              </Grid.Column>
              <Grid.Column width={3}>
                <h3>
                  {isMortgagePending(mortgage)
                    ? t('mortgage.requested')
                    : t('mortgage.outstanding_amount')}
                </h3>
                <Mana
                  amount={
                    isMortgagePending(mortgage)
                      ? parseFloat(mortgage.amount)
                      : parseFloat(mortgage.outstanding_amount)
                  }
                  size={20}
                  scale={1}
                  className="mortgage-amount-icon"
                />
              </Grid.Column>
              {isMortgagePending(mortgage) && (
                <Grid.Column width={3}>
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
                          (startTime + mortgage.payable_at * 1) * 1000,
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
                          (startTime + mortgage.is_due_at * 1) * 1000,
                          10
                        )}
                      />
                    </p>
                  </Grid.Column>
                </React.Fragment>
              )}
              <Grid.Column width={2}>
                <MortgageActions mortgage={mortgage} />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
