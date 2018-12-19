import { SQL } from '../../database'
import { splitCoordinate } from '../../shared/coordinates'

export const ParcelQueries = Object.freeze({
  whereIsBetweenCoordinates: (topLeft, bottomRight) => {
    if (topLeft == null || bottomRight == null) {
      return SQL`1 = 1`
    }

    const [minx, maxy] =
      typeof topLeft === 'string'
        ? splitCoordinate(topLeft)
        : [topLeft.x, topLeft.y]

    const [maxx, miny] =
      typeof bottomRight === 'string'
        ? splitCoordinate(bottomRight)
        : [bottomRight.x, bottomRight.y]

    return SQL`x BETWEEN ${minx} AND ${maxx} AND y BETWEEN ${miny} AND ${maxy}`
  }
})
