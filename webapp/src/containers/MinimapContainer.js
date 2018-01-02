import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { navigateTo } from '../actions'
import locations from '../locations'
import { selectors } from '../reducers'

import Minimap from '../components/Minimap.js'

class MinimapContainer extends React.Component {
  static propTypes = {
    range: PropTypes.shape({
      minX: PropTypes.number,
      minY: PropTypes.number,
      maxX: PropTypes.number,
      maxY: PropTypes.number
    })
  }

  update = (x, y) => {
    this.props.navigateTo(locations.parcelDetail(x, y))
  }

  render() {
    return <Minimap {...this.props.range} update={this.update.bind(this)} />
  }
}

export default connect(
  state => ({
    range: selectors.getRange(state)
  }),
  { navigateTo }
)(MinimapContainer)
