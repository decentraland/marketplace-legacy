import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import { t } from 'modules/translation/utils'
import { locations } from 'locations'

import './EstateActions.css'

export default class EstateActions extends React.PureComponent {
  static propTypes = {
    parcels: PropTypes.array.isRequired,
    onCancel: PropTypes.func.isRequired,
    onEstateCreation: PropTypes.func.isRequired
  }

  handleCancel = () => {
    this.props.onCancel()
  }

  handleContinue = () => {
    const { parcels } = this.props
    this.props.onEstateCreation(parcels)
  }

  render() {
    const { onCancel, onEstateCreation, parcels } = this.props
    return (
      <div className="EstateActions">
        <Button size="tiny" onClick={this.handleCancel}>{t('cancel')}</Button>
        <Button size="tiny" onClick={this.handleContinue}>{t('continue')}</Button>
      </div>
    )
  }
}
