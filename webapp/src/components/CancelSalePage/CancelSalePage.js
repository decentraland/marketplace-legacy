import React from 'react'
import PropTypes from 'prop-types'

import { Container, Header, Grid, Button } from 'semantic-ui-react'
import ParcelName from 'components/ParcelName'
import Parcel from 'components/Parcel'

import { formatMana } from 'lib/utils'
import { t } from 'modules/translation/utils'

import './CancelSalePage.css'

export default class CancelSalePage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  handleConfirm = () => {
    const { publication, onConfirm } = this.props
    onConfirm(publication)
  }

  render() {
    const { x, y, publication, isDisabled, onCancel } = this.props

    return (
      <Parcel x={x} y={y} ownerOnly>
        {parcel => (
          <div className="CancelSalePage">
            <Container text textAlign="center">
              <Header as="h2" size="huge" className="title">
                {t('parcel_cancel.cancel_land')}
              </Header>
              <span className="subtitle">
                <ParcelName parcel={parcel} />&nbsp;
                {publication ? (
                  <React.Fragment>
                    {t('parcel_cancel.currently_on_sale', {
                      value: formatMana(publication.price)
                    })}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {t('parcel_cancel.about_to_cancel')}
                  </React.Fragment>
                )}
              </span>
              {publication ? (
                <span className="subtitle">
                  {t('parcel_cancel.about_to_cancel')}
                </span>
              ) : null}
            </Container>
            <br />
            <Container text>
              <Grid.Column className="text-center">
                <Button onClick={onCancel} type="button">
                  {t('global.cancel')}
                </Button>
                <Button
                  onClick={this.handleConfirm}
                  type="button"
                  negative
                  disabled={isDisabled || !publication}
                >
                  {t('global.confirm')}
                </Button>
              </Grid.Column>
            </Container>
          </div>
        )}
      </Parcel>
    )
  }
}
