import React from 'react'
import PropTypes from 'prop-types'

import { Container, Header, Grid } from 'semantic-ui-react'
import Parcel from 'components/Parcel'
import ParcelName from 'components/ParcelName'
import TxStatus from 'components/TxStatus'
import EditParcelForm from './EditParcelForm'
import { t, t_html } from 'modules/translation/utils'

import './EditParcelPage.css'

export default class EditParcelPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const { x, y, isTxIdle, onSubmit, onCancel } = this.props

    return (
      <Parcel x={x} y={y} ownerOnly>
        {parcel => (
          <div className="EditParcelPage">
            <Container text textAlign="center">
              <Header as="h2" size="huge" className="title">
                {t('parcel_edit.edit_land')}
              </Header>
              <span className="subtitle">
                {t_html('parcel_edit.set_name_and_desc', {
                  parcel_name: <ParcelName parcel={parcel} />
                })}
              </span>
            </Container>
            <br />
            <Container text>
              <Grid.Column>
                <EditParcelForm
                  parcel={parcel}
                  isTxIdle={isTxIdle}
                  onSubmit={onSubmit}
                  onCancel={onCancel}
                />
                <TxStatus.Parcel parcel={parcel} />
              </Grid.Column>
            </Container>
          </div>
        )}
      </Parcel>
    )
  }
}
