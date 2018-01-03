import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectors } from '../reducers'
import { openSidebar, closeSidebar } from '../actions'

import Sidebar from '../components/Sidebar'

class SidebarContainer extends React.Component {
  static propTypes = {
    userParcels: PropTypes.object,
    sidebar: PropTypes.shape({
      open: PropTypes.boolean
    }),
    openSidebar: PropTypes.func.isRequired,
    closeSidebar: PropTypes.func.isRequired
  }

  changeVisibility = visible => {
    if (visible) {
      this.props.openSidebar()
    } else {
      this.props.closeSidebar()
    }
  }

  isLoading() {
    return this.props.loading
  }

  render() {
    const { userParcels, sidebar } = this.props

    return (
      <Sidebar
        visible={sidebar.open}
        userParcels={userParcels}
        isLoading={this.isLoading()}
        changeVisibility={this.changeVisibility}
      />
    )
  }
}

export default connect(
  state => ({
    userParcels: selectors.getUserParcels(state),
    loading: selectors.getLoading(state),
    sidebar: selectors.getSidebar(state)
  }),
  { openSidebar, closeSidebar }
)(SidebarContainer)
