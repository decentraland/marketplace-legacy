export const getState = state => state.mortgages
export const getData = state => getState(state).data
export const getParcels = state => getData(state).parcels
