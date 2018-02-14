import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { Grid, Button } from 'semantic-ui-react'

import { getParcelAttributes } from 'lib/parcelUtils'
import { walletType, parcelType, districtType } from 'components/types'

export default class ParcelDetail extends React.PureComponent {
  static propTypes = {
    wallet: walletType.isRequired,
    districts: PropTypes.objectOf(districtType).isRequired,
    parcel: parcelType.isRequired,
    onTransfer: PropTypes.func.isRequired
  }

  render() {
    const { wallet, parcel, districts, onTransfer } = this.props
    const { x, y } = parcel

    const coordinate = `${x}, ${y}`
    const { backgroundColor, label } = getParcelAttributes(
      wallet,
      parcel,
      districts
    )

    return (
      <Grid
        columns={2}
        stackable={true}
        centered={true}
        className="ParcelDetail"
      >
        <Grid.Column width={7}>
          <h3 className="parcel-name">
            {parcel.name
              ? [
                  parcel.name,
                  <span key="1" className="parcel-name-secondary">
                    &nbsp;{coordinate}
                  </span>
                ]
              : [
                  coordinate,
                  <span key="1" className="parcel-name-secondary">
                    &nbsp;Untitled Parcel
                  </span>
                ]}
          </h3>

          <div className="owned-by">
            Owned by <Link to={locations.parcelMapDetail(x, y)}>{label}</Link>&nbsp;
            <div className="square" style={{ backgroundColor }} />
          </div>

          {parcel.description ? (
            <p className="parcel-description">{parcel.description}</p>
          ) : (
            <p className="parcel-description parcel-description-empty">
              This parcel has no description
            </p>
          )}
        </Grid.Column>

        <Grid.Column width={3}>
          <Button primary={true} onClick={onTransfer}>
            TRANSFER
          </Button>
        </Grid.Column>
      </Grid>
    )
  }
}
