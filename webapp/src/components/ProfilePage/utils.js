import { locations } from 'locations'
import { Location } from 'lib/Location'

export function buildUrl({ address, tab, page }) {
  return Location.buildUrl(locations.profilePage(address, tab), {
    page
  })
}
