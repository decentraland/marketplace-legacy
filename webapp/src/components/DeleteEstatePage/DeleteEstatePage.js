import React from 'react'
import PropTypes from 'prop-types'
import { Message } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import EstateModal from 'components/EstateModal'
import Estate from 'components/Estate'
import { isNewEstate, MAX_PARCELS_PER_TX } from 'shared/estate'

export default class DeleteEstatePage extends React.PureComponent {
  static props = {
    id: PropTypes.string.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
  }

  isTooBig(estate) {
    return estate.data.parcels.length > MAX_PARCELS_PER_TX
  }

  render() {
    const { id, isTxIdle, onCancel, onConfirm } = this.props
    return (
      <Estate id={id} shouldBeOwner>
        {estate => (
          <div className="DeleteEstatePage">
            {this.isTooBig(estate) ? (
              <Message
                warning
                icon="warning sign"
                header={t('estate_dissolve.too_big')}
                content={t('estate_dissolve.too_big_desc', {
                  max: MAX_PARCELS_PER_TX
                })}
              />
            ) : null}
            <EstateModal
              estate={estate}
              parcels={estate.data.parcels}
              title={t('estate_detail.dissolve')}
              subtitle={t('estate_detail.dissolve_desc', {
                name: estate.data.name
              })}
              isTxIdle={isTxIdle}
              onCancel={onCancel}
              onConfirm={onConfirm}
              isDisabled={isNewEstate(estate) || this.isTooBig(estate)}
            />
          </div>
        )}
      </Estate>
    )
  }
}
