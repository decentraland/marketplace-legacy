import React from 'react'
import PropTypes from 'prop-types'
import { Message, Header, Grid, Container, Button } from 'semantic-ui-react'
import { utils } from 'decentraland-commons'

import { parcelType } from 'components/types'
import ParcelPreview from 'components/ParcelPreview'
import ParcelAttributes from 'components/ParcelAttributes'
import { t } from '@dapps/modules/translation/utils'
import { getParcelSorter } from 'shared/parcel'

import './AuctionPage.css'

// TODO: Real number here
const MAX_PARCELS_PER_TX = Infinity

export default class AuctionPage extends React.PureComponent {
  static propTypes = {
    allParcels: PropTypes.objectOf(parcelType)
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedCoordsById: {}
    }
  }

  selectUnownedParcel = (asset, { x, y }) => {
    const { selectedCoordsById } = this.state

    // TODO: Check ownership with contract
    if (asset.owner != null || asset.district_id != null) return

    let newSelectedCoordsById = {}

    const isSelected = selectedCoordsById[asset.id] !== undefined
    if (isSelected) {
      newSelectedCoordsById = utils.omit(selectedCoordsById, asset.id)
    } else {
      newSelectedCoordsById = {
        ...selectedCoordsById,
        [asset.id]: { x, y }
      }
    }

    if (this.hasReachedLimit(newSelectedCoordsById)) return

    this.setState({ selectedCoordsById: newSelectedCoordsById })
  }

  hasReachedLimit(selected) {
    return Object.keys(selected).length > MAX_PARCELS_PER_TX
  }

  handleSubmit = () => {}

  getParcels() {
    const { allParcels } = this.props
    const { selectedCoordsById } = this.state

    if (!allParcels) return []

    const parcelIds = Object.keys(selectedCoordsById)
    const parcels = []

    for (const parcelId of parcelIds) {
      const parcel = allParcels[parcelId]
      if (parcel) {
        parcels.push(parcel)
      }
    }

    return parcels.sort(getParcelSorter())
  }

  render() {
    const { selectedCoordsById } = this.state

    const selected = Object.values(selectedCoordsById)

    return (
      <div className="AuctionPage">
        <div className="parcel-preview">
          <ParcelPreview
            x={0}
            y={0}
            selected={selected}
            isDraggable
            showPopup
            showControls={true}
            showMinimap={true}
            onClick={this.selectUnownedParcel}
          />
        </div>

        <Container>
          <Grid className="auction-details">
            {this.hasReachedLimit(selectedCoordsById) ? (
              <Grid.Row>
                <Grid.Column width={16}>
                  <Message
                    warning
                    icon="warning sign"
                    header={t('auction_page.maximum_parcels_title')}
                    content={t('auction_page.maximum_parcels_message', {
                      max: MAX_PARCELS_PER_TX
                    })}
                  />
                  <p className="warning-parcels-limit" />
                </Grid.Column>
              </Grid.Row>
            ) : null}

            <Grid.Row>
              <Grid.Column width={16}>
                <Header size="large">{t('auction_page.title')}</Header>
              </Grid.Column>
              <Grid.Column width={16} className="selected-parcels">
                <p className="parcels-included-description">
                  {t('auction_page.description')}
                </p>
                <div className="parcels-included">
                  {this.getParcels().map(parcel => (
                    <ParcelAttributes
                      key={parcel.id}
                      parcel={parcel}
                      withLink={false}
                      withTags={false}
                    />
                  ))}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    )
  }
}
