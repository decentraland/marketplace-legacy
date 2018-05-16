import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'semantic-ui-react'

import Mana from 'components/Mana'
import MortgageActions from 'components/MortgageActions'
import Expiration from 'components/Expiration'
import { t } from 'modules/translation/utils'

import './ParcelMortgage.css'

export default class ParcelMortgage extends React.PureComponent {
  static propTypes = {
    mortgages: PropTypes.array.isRequired
  }

  render() {
    const { mortgages } = this.props
    return (
      <Grid className="parcelMortgageDetail">
        {mortgages.map(mortgage => (
          <Grid.Row key={mortgage.mortgage_id}>
            <Grid.Column width={4} className={mortgage.status}>
              <h3>{t('global.mortgage')}</h3>
              <p>{mortgage.status}</p>
            </Grid.Column>
            <Grid.Column width={4}>
              <h3>{t('mortgage.requested')}</h3>
              <Mana
                amount={parseFloat(mortgage.amount, 10)}
                size={20}
                scale={1}
                className="mortgage-amount-icon"
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <h3>{t('global.time_left')}</h3>
              <p>
                <Expiration expiresAt={mortgage.expires_at} />
              </p>
            </Grid.Column>
            <Grid.Column width={4}>
              <MortgageActions mortgage={mortgage} />
            </Grid.Column>
          </Grid.Row>
        ))}
      </Grid>
    )
  }
}
