import React from 'react'
import PropTypes from 'prop-types'

import Icon from './Icon'
import ExpandedSidebar from './ExpandedSidebar'
import CollapsedSidebar from './CollapsedSidebar'

import './Sidebar.css'

export default class Sidebar extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    userParcels: PropTypes.object,
    isLoading: PropTypes.bool,
    changeVisibility: PropTypes.func.isRequired
  }

  static defaultProps = {
    visible: true,
    isLoading: false
  }

  toggle = () => {
    const { visible, changeVisibility } = this.props
    changeVisibility(!visible)
  }

  hide = () => {
    this.props.changeVisibility(false)
  }

  getVisibilityClassName() {
    return this.props.visible ? 'in' : 'out'
  }

  getDecentralandIconName() {
    return this.props.isLoading ? 'decentraland-loading' : 'decentraland'
  }

  render() {
    let { userParcels, visible } = this.props

    return (
      <div className={`Sidebar ${this.getVisibilityClassName()}`}>
        <header>
          <Icon name={this.getDecentralandIconName()} />
          {visible && <h1 className="sidebar-title fadein">Marketplace</h1>}
        </header>

        {visible ? (
          <ExpandedSidebar userParcels={userParcels} />
        ) : (
          <CollapsedSidebar onClick={this.toggle} />
        )}

        <div
          className={`toggle-button ${this.getVisibilityClassName()}`}
          onClick={this.toggle}
        />
      </div>
    )
  }
}
