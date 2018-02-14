// Fetch Publications

export const FETCH_PUBLICATIONS_REQUEST = '[Request] Fetch Publications'
export const FETCH_PUBLICATIONS_SUCCESS = '[Success] Fetch Publications'
export const FETCH_PUBLICATIONS_FAILURE = '[Failure] Fetch Publications'

export function fetchPublicationsRequest({
  limit,
  offset,
  sortBy,
  sortOrder
} = {}) {
  return {
    type: FETCH_PUBLICATIONS_REQUEST,
    limit,
    offset,
    sortBy,
    sortOrder
  }
}

export function fetchPublicationsSuccess(publications, total) {
  return {
    type: FETCH_PUBLICATIONS_SUCCESS,
    publications,
    total
  }
}

export function fetchPublicationsFailure(error) {
  return {
    type: FETCH_PUBLICATIONS_FAILURE,
    error
  }
}

// Publish LAND

export const PUBLISH_REQUEST = '[Request] Publish LAND'
export const PUBLISH_SUCCESS = '[Success] Publish LAND'
export const PUBLISH_FAILURE = '[Failure] Publish LAND'

export function publishRequest(data = {}) {
  return {
    type: PUBLISH_REQUEST,
    data
  }
}

export function publishSuccess(publication) {
  return {
    type: PUBLISH_SUCCESS,
    publication
  }
}

export function publishFailure(error) {
  return {
    type: PUBLISH_FAILURE,
    error
  }
}
