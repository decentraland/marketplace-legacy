import React from 'react'
import ContributionRow from '../ContributionRow'

class ContributionTable extends React.PureComponent {
  render() {
    const { contributions } = this.props

    if (contributions.length) {
      return (
        <div className="table">
          <div className="table-row table-header">
            <div className="col col-district">DISTRICT</div>
            <div className="col col-contributed">CONTRIBUTED</div>
            <div className="col col-proposal">PROPOSAL</div>
          </div>

          {contributions.map((contribution, index) => (
            <ContributionRow key={index} contribution={contribution} />
          ))}
        </div>
      )
    } else {
      return (
        <div className="table-row-empty">
          {"You haven't contributed land to any districts."}
        </div>
      )
    }
  }
}

export default ContributionTable
