import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'semantic-ui-react'

import Mana from 'components/Mana'
import MortgageActions from 'components/MortgageActions'
import { t } from 'modules/translation/utils'

export default class ParcelMortgage extends React.PureComponent {
  static propTypes = {
    mortgages: PropTypes.array.isRequired,
  }

  render() {
    const { mortgages } = this.props
    return (
      <Grid>
        {mortgages.map(mortgage => (
          <Grid.Row key={mortgage.mortgage_id}>
            <Grid.Column width={4}>
              <h3>{t('mortgage')}</h3>
              <p>{mortgage.status}</p>
            </Grid.Column>
            <Grid.Column width={4}>
              <h3>{t('amount')}</h3>
              <Mana
                amount={parseFloat(mortgage.amount, 10)}
                size={20}
                className="mana-price-icon"
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <h3>{t('expires')}</h3>
              <p>{mortgage.expires_at - Date.now()}</p>
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
