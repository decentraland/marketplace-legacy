import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'components/Icon'
import ExpandedSidebar from './ExpandedSidebar'
import CollapsedSidebar from './CollapsedSidebar'

import './Sidebar.css'

export default class Sidebar extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    address: PropTypes.string,
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
    let { address, visible } = this.props

    return (
      <div className={`Sidebar ${this.getVisibilityClassName()}`}>
        <header>
          <Icon name={this.getDecentralandIconName()} />
          {visible && <h1 className="sidebar-title fadein">Decentraland</h1>}
        </header>

        {visible ? (
          <ExpandedSidebar address={address} />
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
