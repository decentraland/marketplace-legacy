import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'components/Icon'
import ExpandedSidebar from './ExpandedSidebar'
import CollapsedSidebar from './CollapsedSidebar'

import './Sidebar.css'

export default class Sidebar extends React.Component {
  static propTypes = {
    address: PropTypes.string,
    balance: PropTypes.number,
    isOpen: PropTypes.bool,
    isLoading: PropTypes.bool,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }

  static defaultProps = {
    visible: true,
    isLoading: false
  }

  toggle = () => {
    const { isOpen, onOpen, onClose } = this.props

    if (isOpen) {
      onClose()
    } else {
      onOpen()
    }
  }

  hide = () => {
    const { onClose } = this.props
    onClose()
  }

  getSidebarClasses() {
    const { isOpen } = this.props
    return isOpen ? 'in' : 'out'
  }

  getDecentralandIconName() {
    const { isLoading } = this.props
    return isLoading ? 'decentraland-loading' : 'decentraland'
  }

  render() {
    let { address, balance, isOpen } = this.props
    const classes = this.getSidebarClasses()

    const header = isOpen ? (
      <h1 className="sidebar-title fadein">Decentraland</h1>
    ) : null

    const sidebar = isOpen ? (
      <ExpandedSidebar address={address} balance={balance} />
    ) : (
      <CollapsedSidebar onClick={this.toggle} />
    )

    return (
      <div className="Sidebar">
        <div className={`sidebar-content ${classes}`}>
          <header>
            <Icon name={this.getDecentralandIconName()} />
            {header}
          </header>
          {sidebar}
          <div className={`toggle-button ${classes}`} onClick={this.toggle} />
        </div>
      </div>
    )
  }
}
