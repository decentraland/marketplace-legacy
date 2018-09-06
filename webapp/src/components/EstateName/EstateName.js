import React from 'react'
import { Link } from 'react-router-dom'

import { locations } from 'locations'
import { estateType } from 'components/types'
import './EstateName.css'

export default class EstateName extends React.PureComponent {
  static propTypes = {
    estate: estateType
  }

  render() {
    const { id, data } = this.props.estate
    return (
      <div className="EstateName">
        <Link to={locations.estateDetail(id)} className="ui">
          <span className="name">{data.name}&nbsp;</span>
        </Link>
      </div>
    )
  }
}
