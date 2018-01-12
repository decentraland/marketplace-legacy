import React from 'react'
import DistrictLink from '../DistrictLink'

class ContributionRow extends React.PureComponent {
  render() {
    const { contribution } = this.props

    return (
      <div className="table-row">
        <div className="col col-district">
          <DistrictLink contribution={contribution} />
        </div>
        <div className="col col-contributed">
          {contribution.land_count.toLocaleString()} LAND ({contribution.land_count *
            1000}{' '}
          MANA)
        </div>
      </div>
    )
  }
}

export default ContributionRow
