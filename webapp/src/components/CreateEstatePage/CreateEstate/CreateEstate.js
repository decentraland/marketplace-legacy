import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'semantic-ui-react'

import EstateActions from './EstateActions'
import { t } from 'modules/translation/utils'

export default class CreateEstate extends React.PureComponent {
  static propTypes = {
    parcels: PropTypes.array.isRequired,
    onCancel: PropTypes.func.isRequired,
    onEstateCreation: PropTypes.func.isRequired
  }

  render() {
    const { onCancel, onEstateCreation, parcels } = this.props

    return (
      <div className="ParcelDetail">
        <Grid>
          <Grid.Row className="parcel-detail-row">
            <Grid.Column width={8}>
              <h3>{t('parcel_estate.creation.title')}</h3>
            </Grid.Column>
            <Grid.Column className="parcel-actions-container" width={8}>
              <EstateActions
                onCancel={onCancel}
                onEstateCreation={onEstateCreation}
                parcels={parcels}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
