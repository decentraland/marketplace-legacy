// Open Modal

export const OPEN_MODAL = 'Open Modal'

export function openModal(name = '', data = null) {
  return {
    type: OPEN_MODAL,
    name,
    data
  }
}

// Close Modal

export const CLOSE_MODAL = 'Close Modal'

export function closeModal() {
  return {
    type: CLOSE_MODAL
  }
}
