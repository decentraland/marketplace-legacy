// Set Loading

export const SET_LOADING = 'Set Loading'

export function setLoading(value = false) {
  return {
    type: SET_LOADING,
    value
  }
}
