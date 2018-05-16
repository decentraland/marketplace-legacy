import React from 'react'
import PropTypes from 'prop-types'
import { Button, Grid, Header } from 'semantic-ui-react'
import ParcelPreview from 'components/ParcelPreview'
import { t } from 'modules/translation/utils'
import './ParcelModal.css'

export default class ParcelModal extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
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

  render() {
    const {
      x,
      y,
      title,
      subtitle,
      isDisabled,
      hasCustomFooter,
      cancelLabel,
      confirmLabel,
      onCancel,
      onConfirm,
      preview,
      children
    } = this.props

    return (
      <div className="ParcelModal">
        <div className="modal-column">
          {preview ? (
            preview
          ) : (
            <div className="modal-preview">
              <ParcelPreview x={x} y={y} selected={{ x, y }} size={20} />
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
