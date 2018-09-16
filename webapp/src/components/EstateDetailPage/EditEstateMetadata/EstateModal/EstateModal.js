import React from 'react'
import PropTypes from 'prop-types'
import { Button, Grid, Header } from 'semantic-ui-react'

import ParcelPreview from 'components/ParcelPreview'
import TxStatus from 'components/TxStatus'
import EstateName from 'components/EstateName'
import { coordsType, estateType } from 'components/types'
import { t } from 'modules/translation/utils'
import { calculateMapProps } from 'shared/estate'
import './EstateModal.css'

export default class EstateModal extends React.PureComponent {
  static propTypes = {
    estate: estateType,
    parcels: PropTypes.arrayOf(coordsType).isRequired,
    isDisabled: PropTypes.bool,
    hasCustomFooter: PropTypes.bool,
    cancelLabel: PropTypes.string,
    confirmLabel: PropTypes.string,
    children: PropTypes.node,
    preview: PropTypes.node,
    isTxIdle: PropTypes.bool
  }

  static defaultProps = {
    isDisabled: false,
    hasCustomFooter: false,
    onCancel: () => {},
    onConfirm: () => {}
  }

  render() {
    const {
      estate,
      parcels,
      title,
      subtitle,
      isDisabled,
      hasCustomFooter,
      cancelLabel,
      confirmLabel,
      onCancel,
      onConfirm,
      children,
      preview,
      isTxIdle
    } = this.props

    const size = 20
    const { center, zoom, pan } = calculateMapProps(parcels, size)
    return (
      <div className="EstateModal">
        <div className="modal-column">
          {preview ? (
            preview
          ) : (
            <div className="modal-preview">
              <ParcelPreview
                x={center.x}
                y={center.y}
                selected={parcels}
                zoom={zoom}
                size={size}
                panX={pan.x}
                panY={pan.y}
              />
            </div>
          )}
        </div>
        <div className="modal-column">
          <div>
            <Header as="h4" size="large" className="modal-title">
              {title}
            </Header>
            <span className="modal-subtitle">{subtitle}</span>
          </div>
          <div className="modal-children">
            {children ? children : null}
            {hasCustomFooter ? null : (
              <React.Fragment>
                <Grid.Column>
                  <TxStatus.Idle isIdle={isTxIdle} />
                  <div className="modal-buttons">
                    <Button onClick={onCancel} type="button">
                      {cancelLabel || t('global.cancel')}
                    </Button>
                    <Button
                      onClick={onConfirm}
                      type="button"
                      primary
                      disabled={isDisabled}
                    >
                      {confirmLabel || t('global.confirm')}
                    </Button>
                  </div>
                  <TxStatus.Asset
                    asset={estate}
                    name={<EstateName estate={estate} />}
                  />
                </Grid.Column>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    )
  }
}
