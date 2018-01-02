export const COLORS = {
  littleValue: '#FFF189',
  bigValue: '#EF303B'
}

export const CLASS_NAMES = {
  won: 'won',
  winning: 'winning',
  lost: 'lost',
  outbid: 'outbid',
  taken: 'taken',
  genesis: 'genesis',
  district: 'district',
  roads: 'roads',
  default: 'default',
  pending: 'pending',
  loading: 'loading'
}

export function getClassName() {
  return CLASS_NAMES.default
}

export function getBidStatus() {
  return CLASS_NAMES.default
}

export function getBounds() {
  return {
    minX: -153,
    minY: -153,
    maxX: 153,
    maxY: 153
  }
}
