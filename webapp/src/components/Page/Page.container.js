import { connect } from 'react-redux'

import { fetchDistrictsRequest } from 'modules/districts/actions'
import { openModal } from 'modules/ui/actions'
import { isRootPage } from 'modules/location/selectors'

import Page from './Page'

const mapState = state => ({
  isRootPage: isRootPage(state)
})

const mapDispatch = dispatch => ({
  onFetchDistricts: () => dispatch(fetchDistrictsRequest()),
  onFirstVisit: () => dispatch(openModal('TermsModal'))
})

export default connect(mapState, mapDispatch)(Page)
