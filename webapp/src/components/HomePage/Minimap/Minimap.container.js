import { connect } from 'react-redux'
import locations from 'locations'
import { selectors } from 'reducers'
import { navigateTo } from 'actions'

import Minimap from 'components/HomePage/Minimap'

const mapState = state => {
  const { minX, minY, maxX, maxY } = selectors.getRange(state)
  return {
    minX,
    minY,
    maxX,
    maxY
  }
}

const mapDispatch = dispatch => ({
  onUpdate: (x, y) => dispatch(navigateTo(locations.parcelDetail(x, y)))
})

export default connect(mapState, mapDispatch)(Minimap)
