import React from 'react'
import PropTypes from 'prop-types'

import { Container, Header, Grid } from 'semantic-ui-react'
import Parcel from 'components/Parcel'
import ParcelName from 'components/ParcelName'
import TxStatus from 'components/TxStatus'
import { publicationType } from 'components/types'
import { hasPublication } from 'lib/parcelUtils'
import { t, t_html } from 'modules/translation/utils'

import TransferParcelForm from './TransferParcelForm'

import './TransferParcelPage.css'

export default class TransferParcelPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    transferError: PropTypes.string,
    publications: PropTypes.objectOf(publicationType),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCleanTransfer: PropTypes.func.isRequired
  }

  render() {
    const { x, y, isTxIdle, transferError, publications } = this.props
    const { onSubmit, onCancel, onCleanTransfer } = this.props
    return (
      <Parcel x={x} y={y} ownerOnly>
        {parcel => (
          <div className="TransferParcelPage">
            <Container text textAlign="center">
              <Header as="h2" size="huge" className="title">
                {t('parcel_transfer.transfer_land')}
              </Header>
              <div className="subtitle">
                {t_html('parcel_transfer.about_to_transfer', {
                  parcel_name: <ParcelName parcel={parcel} />
                })}
                <br />
                {t('parcel_transfer.irreversible')}
                <br />
                {t('parcel_transfer.check_address')}
                <br />
              </div>
            </Container>
            <br />
            <Container text>
              <Grid.Column>
                <TransferParcelForm
                  parcel={parcel}
                  isTxIdle={isTxIdle}
                  transferError={transferError}
                  onSubmit={onSubmit}
                  onCancel={onCancel}
                  onCleanTransfer={onCleanTransfer}
                  hasPublication={hasPublication(parcel, publications)}
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
