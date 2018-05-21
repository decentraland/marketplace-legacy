import React from 'react'
import PropTypes from 'prop-types'
import { Button, Grid, Header } from 'semantic-ui-react'
import ParcelPreview from 'components/ParcelPreview'
import { coordsType } from 'components/types'
import { t } from 'modules/translation/utils'
import './EstateModal.css'

export default class EstateModal extends React.PureComponent {
  static propTypes = {
    parcels: PropTypes.arrayOf(coordsType).isRequired,
    isDisabled: PropTypes.bool,
    hasCustomFooter: PropTypes.bool,
    cancelLabel: PropTypes.string,
    confirmLabel: PropTypes.string,
    children: PropTypes.node,
    preview: PropTypes.node
  }

  static defaultProps = {
    isDisabled: false,
    hasCustomFooter: false,
    onCancel: () => {},
    onConfirm: () => {}
  }

  calculateZoomAndCenter() {
    const { parcels } = this.props
    const xs = [...new Set(parcels.map(coords => coords.x).sort())]
    const ys = [...new Set(parcels.map(coords => coords.y).sort())]
    const x = xs[parseInt(xs.length / 2)]
    const y = ys[parseInt(ys.length / 2)]
    const center = { x, y }
    const zoom = 1 / (xs.length + ys.length) * 7.5
    return { center, zoom }
  }

  render() {
    const {
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
      preview
    } = this.props

    const { center, zoom } = this.calculateZoomAndCenter()

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
                zoom={zoom}
                selected={parcels}
                size={20}
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
          <br />
          {children ? (
            <React.Fragment>
              <div className="modal-children">{children}</div>
              <br />
            </React.Fragment>
          ) : null}
          {hasCustomFooter ? null : (
            <div>
              <Grid.Column className="modal-buttons">
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
              </Grid.Column>
            </div>
          )}
        </div>
      </div>
    )
  }
}
