import React from 'react'
import PropTypes from 'prop-types'
import { Message } from 'semantic-ui-react'
import EstateModal from 'components/EstateDetailPage/EditEstateMetadata/EstateModal'
import Estate from 'components/Estate'
import { t } from '@dapps/modules/translation/utils'
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
      <div className="DeleteEstatePage">
        <Estate id={id} ownerOnly>
          {estate => (
            <React.Fragment>
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
            </React.Fragment>
          )}
        </Estate>
      </div>
    )
  }
}
