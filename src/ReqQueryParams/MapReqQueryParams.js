import { ReqQueryParams } from './ReqQueryParams'
import { Bounds } from '../shared/map'
import * as coordinates from '../shared/coordinates'

const { minX, minY, maxX, maxY } = Bounds.getBounds()

export class MapReqQueryParams {
  constructor(req) {
    this.reqQueryParams = new ReqQueryParams(req)
  }

  sanitize() {
    return {
      x: this.getInteger('x', minX, maxX, 0),
      y: this.getInteger('y', minY, maxY, 0),
      width: this.getInteger('width', 32, 1024, 500),
      height: this.getInteger('height', 32, 1024, 500),
      size: this.getInteger('size', 1, 40, 10),
      center: this.getCoords('center', { x: 0, y: 0 }),
      selected: this.getCoordsArray('selected', []),
      address: this.reqQueryParams.get('address', ''),
      skipOnSale: !this.reqQueryParams.getBoolean('publications', false) // Mind the negation here
    }
  }

  getInteger(name, min, max, defaultValue) {
    const value = this.reqQueryParams.getInteger(name, defaultValue)
    return value > max ? max : value < min ? min : value
  }

  getCoords(name, defaultValue) {
    let param
    try {
      param = this.reqQueryParams.get(name)
    } catch (error) {
      return defaultValue
    }

    let coords
    try {
      const [x, y] = coordinates.splitCoordinate(param)
      coords = { x, y }
    } catch (error) {
      throw new Error(
        `Invalid param "${name}" should be a coordinate "x,y" but got "${param}".`
      )
    }
    return coords
  }

  getCoordsArray(name, defaultValue) {
    let param
    try {
      param = this.reqQueryParams.get(name)
    } catch (error) {
      return defaultValue
    }

    let coordsArray = []
    try {
      coordsArray = param.split(';').map(pair => {
        const [x, y] = coordinates.splitCoordinate(pair)
        return { x, y }
      })
    } catch (error) {
      throw new Error(
        `Invalid param "${name}" should be a list of coordinates "x1,y1;x2,y2" but got "${param}".`
      )
    }
    return coordsArray
  }
}
