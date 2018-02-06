// Open Toast

export const OPEN_TOAST = 'Open Toast'

export function openToast({ id, kind, message, delay } = {}) {
  return {
    type: OPEN_TOAST,
    id: id || Date.now().toString(),
    kind,
    message,
    delay
  }
}

// Close Toast

export const CLOSE_TOAST = 'Close Toast'

export function closeToast(id) {
  return {
    type: CLOSE_TOAST,
    id
  }
}

// Open Info Toast

export function openInfoToast(message) {
  return openToast({ kind: 'info', message })
}

// Open Success Toast

export function openSuccessToast(message) {
  return openToast({ kind: 'success', message })
}

// Open Error Toast

export function openErrorToast(message) {
  return openToast({ kind: 'error', message })
}

// Open Warning Toast

export function openWarningToast(message) {
  return openToast({ kind: 'warning', message })
}
