import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'semantic-ui-react'
import ParcelPreview from 'components/ParcelPreview'
import CreateEstate from './CreateEstate'
import Parcel from 'components/Parcel'
import { t } from 'modules/translation/utils'

import './CreateEstatePage.css'

export default class CreateEstatePage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    onError: PropTypes.func.isRequired,
    onParcelClick: PropTypes.func.isRequired
  }

  render() {
    const { x, y, error, onParcelClick } = this.props

    if (error) {
      return null
    }
    return (
      <Parcel x={x} y={y}>
        {(parcel, isOwner) => (
          <div className="CreateDetailPage">
            <div className="parcel-preview" title={t('parcel_detail.view')}>
              <ParcelPreview
                x={parcel.x}
                y={parcel.y}
                selected={parcel}
                isDraggable
                showMinimap
                showPopup
                showControls
                onClick={onParcelClick}
              />
            </div>
            <Container>
              <CreateEstate />
            </Container>
          </div>
        )}
      </Parcel>
    )
  }
}
