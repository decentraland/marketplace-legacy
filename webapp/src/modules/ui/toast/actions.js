export const OPEN_TOAST = 'Open Toast'
export const CLOSE_TOAST = 'Close Toast'

export function openInfoToast(message) {
  return openToast('info', message)
}

export function openSuccessToast(message) {
  return openToast('success', message)
}

export function openErrorToast(message) {
  return openToast('error', message)
}

export function openWarningToast(message) {
  return openToast('warning', message)
}

export function openToast({ id, kind, message, delay } = {}) {
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
