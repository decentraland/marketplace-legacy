export const OPEN_SIDEBAR = 'Open Sidebar'
export const CLOSE_SIDEBAR = 'Close Sidebar'

export function openSidebar() {
  return {
    type: OPEN_SIDEBAR
  }
}

export function closeSidebar() {
  return {
    type: CLOSE_SIDEBAR
  }
}
