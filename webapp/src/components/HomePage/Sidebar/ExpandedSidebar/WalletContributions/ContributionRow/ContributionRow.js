import React from 'react'
import DistrictLink from '../DistrictLink'
import Icon from 'components/Icon'
import { land } from 'lib/land'

class ContributionRow extends React.PureComponent {
  render() {
    const { contribution } = this.props

    const link = contribution.district ? contribution.district.link : void 0

    return (
      <div className="table-row">
        <div className="col col-district">
          <DistrictLink contribution={contribution} />
        </div>
        <div className="col col-contributed">
          {contribution.land_count.toLocaleString()} LAND ({land.convert(
            contribution.land_count,
            'mana'
          )}
          &nbsp;MANA)
        </div>
        <div className="col col-proposal">
          <a href={link} className="link" target="_blank" rel="noopener">
            <Icon name="external-link" /> Link
          </a>
        </div>
      </div>
    )
  }
}

export default ContributionRow
