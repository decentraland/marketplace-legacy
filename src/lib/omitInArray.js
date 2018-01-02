import { utils } from 'decentraland-commons'

export default function omitInArray(array, omittedProps = []) {
  return array.map(obj => {
    const nullProps = []

    for (let prop in obj) {
      if (obj[prop] === null) {
        nullProps.push(prop)
      }
    }

    return utils.omit(obj, nullProps.concat(omittedProps))
  })
}
