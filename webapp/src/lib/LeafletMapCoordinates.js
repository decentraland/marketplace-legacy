import L from 'leaflet'

export default class LeafletMapCoordinates {
  constructor(map, tileSize) {
    this.map = map
    this.tileSize = tileSize
    this.origin = map.project(map.getBounds().getNorthWest())
  }

  toLatLngBounds(bounds) {
    const [lower, upper] = bounds

    const southWest = this.cartesianToLatLng({ x: lower[0], y: lower[1] })
    const northEast = this.cartesianToLatLng({ x: upper[0], y: upper[1] })

    return new L.LatLngBounds(southWest, northEast)
  }

  cartesianToLatLng({ x, y }) {
    const offsetX = x * this.tileSize
    const offsetY = -y * this.tileSize

    const point = new L.Point(
      Math.round(offsetX + this.origin.x),
      Math.round(offsetY + this.origin.y)
    )
    return this.map.unproject(point)
  }

  latLngToCartesian(bounds) {
    const offset = this.map.project(bounds)
    const offsetX = offset.x - this.origin.x
    const offsetY = this.origin.y - offset.y

    return {
      x: Math.round(offsetX / this.tileSize),
      y: Math.round(offsetY / this.tileSize)
    }
  }
}
