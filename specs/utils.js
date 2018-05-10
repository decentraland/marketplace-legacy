import { utils } from 'decentraland-commons'

export function omitProps(obj, omittedProps) {
  const newObj = utils.omit(obj, omittedProps)

  for (const prop in newObj) {
    const value = newObj[prop]

    if (value !== null && typeof value === 'object') {
      newObj[prop] = omitProps(value, omittedProps)
    }
  }

  return newObj
}
