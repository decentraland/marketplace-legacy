export const OPEN_TOAST = 'Open Toast'
export const CLOSE_TOAST = 'Close Toast'

export function openToast(message, kind, id, delay) {
  return {
    type: OPEN_TOAST,
    id: id || Date.now().toString(),
    kind,
    message,
    delay
  }
}

export function closeToast(id) {
  return {
    type: CLOSE_TOAST,
    id
  }
}
