import React from 'react'
import SidebarStats from './SidebarStats'

import './CollapsedSidebar.css'

export default function CollapsedSidebar({ dashboard, onClick }) {
  return (
    <div className="CollapsedSidebar" onClick={onClick}>
      <SidebarStats />
    </div>
  )
}
