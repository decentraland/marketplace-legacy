import React from 'react'
import PropTypes from 'prop-types'

import Estate from 'components/Estate'
import { ACTIONS } from 'shared/roles'
import EditEstateMetadata from './EditEstateMetadata'

export default class EditEstateMetadataPage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired
  }

  render() {
    const { id, onSubmit, onCancel } = this.props

    return (
      <Estate id={id} shouldBeAllowedTo={[ACTIONS.updateMetadata]}>
        {estate => (
          <EditEstateMetadata
            estate={estate}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        )}
      </Estate>
    )
  }
}
