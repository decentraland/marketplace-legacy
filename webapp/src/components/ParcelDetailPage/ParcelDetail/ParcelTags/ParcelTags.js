import React from 'react'
import PropTypes from 'prop-types'

import { Grid } from 'semantic-ui-react'
import { parcelType, districtType } from 'components/types'
import Icon from 'components/Icon'
import { isRoad, isPlaza } from 'lib/parcelUtils'
import { t } from 'modules/translation/utils'

import './ParcelTags.css'

export default class ParcelTags extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    districts: PropTypes.objectOf(districtType)
  }

  renderTag(tag, index) {
    const name = isPlaza(tag.id)
      ? 'plaza'
      : isRoad(tag.id) ? 'road' : 'district'

    return (
      <div className="tag" key={tag.id}>
        <Icon name={`${name}-tag`} />
        <div className="tag-information">
          <h4>{t(`parcel_detail.tags.${name}`)}</h4>
          <p>
            {tag.length === 0
              ? t('parcel_detail.tags.no_distance')
              : t('parcel_detail.tags.distance', { length: tag.length })}
          </p>
        </div>
      </div>
    )
  }

  render() {
    const { parcel } = this.props

    if (!parcel.tags) {
      return null
    }

    return (
      <Grid stackable className="ParcelTags parcel-detail-row">
        <Grid.Row>
          <Grid.Column>
            <h3>{t('parcel_detail.tags.title')}</h3>
              {Object.values(parcel.tags).map(tag => this.renderTag(tag))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
