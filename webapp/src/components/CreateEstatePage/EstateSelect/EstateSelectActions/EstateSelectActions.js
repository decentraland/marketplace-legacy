import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import { Grid } from 'semantic-ui-react'
import { t } from 'modules/translation/utils'

import './EstateSelectActions.css'

export default class EstateSelectActions extends React.PureComponent {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  }

  render() {
    const { onCancel, onContinue, disabled } = this.props
    return (
      <div className="ParcelDetail">
        <Grid>
          <Grid.Row className="parcel-detail-row">
            <Grid.Column width={8}>
              <h3>{t('estate_select.selection')}</h3>
            </Grid.Column>
            <Grid.Column className="parcel-actions-container" width={8}>
              <div className="EstateActions">
                <Button size="tiny" onClick={onCancel}>
                  {t('cancel')}
                </Button>
                <Button size="tiny" disabled={disabled} onClick={onContinue}>
                  {t('continue')}
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
