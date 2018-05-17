import React from 'react'
import { Grid } from 'semantic-ui-react'

import EstateActions from './EstateActions'
import { parcelType } from 'components/types'
import { t } from 'modules/translation/utils'

export default class CreateEstate extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired
  }

  render() {
    const { parcel, isOwner } = this.props

    return (
      <div className="ParcelDetail">
        <Grid>
          <Grid.Row className="parcel-detail-row">
            <Grid.Column width={8}>
              <h3>{t('parcel_estate.creation.title')}</h3>
            </Grid.Column>
            <Grid.Column className="parcel-actions-container" width={8}>
              <EstateActions parcel={parcel} isOwner={isOwner} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
