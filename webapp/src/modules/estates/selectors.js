import { createSelector } from 'reselect'

export const getState = state => state.estates
export const getData = state => getState(state).data

export const getEstates = createSelector(getData, estates => {
  return estates
})
