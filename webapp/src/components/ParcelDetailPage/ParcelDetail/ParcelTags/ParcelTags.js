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

  renderProximityTag(tag, index) {
    const name = isPlaza(tag.id)
      ? 'plaza'
      : isRoad(tag.id) ? 'road' : 'district'

    return (
      <div className="tag" key={tag.id}>
        <div className={`tag-icon tag-icon-${name}`}>
          <Icon name={`${name}-icon`} />
        </div>

        <div className="tag-information">
          <h4>{t(`parcel_detail.tags.${name}`)}</h4>
          <p>
            {tag.distance === 0
              ? t('parcel_detail.tags.adjacent')
              : t('parcel_detail.tags.proximity', { distance: tag.distance })}
          </p>
        </div>
      </div>
    )
  }

  render() {
    const { proximity } = this.props.parcel.tags

    if (!proximity) {
      return null
    }

    return (
      <Grid stackable className="ParcelTags parcel-detail-row">
        <Grid.Row>
          <Grid.Column>
            <h3>{t('parcel_detail.tags.title')}</h3>
            {Object.values(proximity).map(tag => this.renderProximityTag(tag))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
